import moment from 'moment'
import * as GeoTIFF from 'geotiff'
import { SortOrder, Grid1D } from './grid.js'

export async function getMetadata (url) {
  const geotiff = await GeoTIFF.fromUrl(url)
  const [numImages, refImage] = await Promise.all([geotiff.getImageCount(), geotiff.getImage()])
  const bbox = refImage.getBoundingBox()
  const metadata = {
    geotiff,
    refImage,
    numImages,
    spatialBounds: {
      minLon: bbox[0],
      minLat: bbox[1],
      maxLon: bbox[2],
      maxLat: bbox[3]
    }
  }
  return metadata
}

export async function fetch (meta, { minLon, minLat, maxLon, maxLat }, { resLon, resLat }, abort) {
  // select the image with the closest resolution
  let usedImage = meta.refImage
  for (let i = 1; i < meta.numImages; ++i) {
    const img = await meta.geotiff.getImage(i)
    const [rx, ry] = img.getResolution(meta.refImage)
    if (Math.abs(rx) > resLon || Math.abs(ry) > resLat) break
    usedImage = img
  }

  const [rx, ry] = usedImage.getResolution(meta.refImage)
  const [ox, oy] = meta.refImage.getOrigin()
  const [sx, sy] = [usedImage.getWidth(), usedImage.getHeight()]

  let left = (minLon - ox) / rx
  let right = (maxLon - ox) / rx
  let bottom = (minLat - oy) / ry
  let top = (maxLat - oy) / ry

  if (rx < 0) [left, right] = [right, left]
  if (ry < 0) [bottom, top] = [top, bottom]

  left = Math.min(sx - 1, Math.max(0, Math.floor(left)))
  right = Math.min(sx - 1, Math.max(0, Math.ceil(right)))
  bottom = Math.min(sy - 1, Math.max(0, Math.floor(bottom)))
  top = Math.min(sy - 1, Math.max(0, Math.ceil(top)))

  // readRasters will fetch [left, right[ and [bottom, top[ hence the + 1
  const window = [left, bottom, right + 1, top + 1]
  const bands = await usedImage.readRasters({ window: window, fillValue: meta.nodata, signal: abort })
  const data = bands[0]

  if (rx < 0) [left, right] = [right, left]
  if (ry < 0) [bottom, top] = [top, bottom]

  const dataBbox = [
    oy + (bottom * ry),
    ox + (left * rx),
    oy + (top * ry),
    ox + (right * rx)
  ]

  return new Grid1D(
    0,
    dataBbox, [bands.height, bands.width],
    data, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
    meta.nodata)
}

export async function probe (meta, { lon, lat }, abort) {
  const image = meta.refImage
  const [rx, ry] = image.getResolution()
  const [ox, oy] = image.getOrigin()
  const [sx, sy] = [image.getWidth(), image.getHeight()]

  // lat, lon to pixels
  const x = (lon - ox) / rx
  const y = (lat - oy) / ry

  const left = Math.min(sx - 1, Math.max(0, Math.floor(x)))
  const right = Math.min(sx - 1, Math.max(0, Math.ceil(x)))
  const bottom = Math.min(sy - 1, Math.max(0, Math.floor(y)))
  const top = Math.min(sy - 1, Math.max(0, Math.ceil(y)))

  // readRasters will fetch [left, right[ and [bottom, top[ hence the + 1
  const window = [left, bottom, right + 1, top + 1]
  const bands = await image.readRasters({ window: window, fillValue: meta.nodata, signal: abort })
  const data = bands[0]

  const winLeft = ox + left * rx
  const winRight = ox + right * rx
  const winTop = oy + top * ry
  const winBottom = oy + bottom * ry

  const res = {
    bottomLeft:  { lon: winLeft,  lat: winBottom, val: data[0] },
    bottomRight: { lon: winRight, lat: winBottom, val: data[1] },
    topLeft:     { lon: winLeft,  lat: winTop,    val: data[2] },
    topRight:    { lon: winRight, lat: winTop,    val: data[3] }
  }
  return res
}

async function parallelExec(tasklist, concurrency) {
  const pending = Array.from({ length: concurrency }, (v, k) => null)
  const tickets = Array.from({ length: concurrency }, (v, k) => k)
  for (const task of tasklist) {
    const job = task.job()
    const index = tickets.pop()
    job.then(() => {
      // job done, make room for new job
      tickets.push(index)
      task.success()
    }).catch(() => {
      // job failed, make room for new job
      tickets.push(index)
      task.fail()
    })
    pending[index] = job
    if (tickets.length == 0) {
      try {
        await Promise.race(pending)
      } catch(err) {
        // some job failed, keep on
      }
    }
  }

  await Promise.allSettled(pending)
}

export async function probeTimeRange (urlGenerator, context, timeVar, contextUpdaters, { lon, lat }, { t0, t1 }, every, abort) {
  const probes = []
  let success = true
  for (let t = t0; t <= t1; t += every) {
    context[timeVar] = moment(t)
    for (const upd of contextUpdaters) {
      const addition = upd(context)
      Object.assign(context, addition)
    }
    const probeTask = {
      url: urlGenerator(context),
      time: context[timeVar],
      job: async () => {
        const meta = await getMetadata(probeTask.url)
        probeTask.result = await probe(meta, { lon, lat }, abort)
      },
      success: () => { },
      fail: () => { success = false },
    }
    probes.push(probeTask)
  }

  await parallelExec(probes, 4)

  // if (!success) return []

  return probes.filter((probe) => { return probe.result !== undefined }).map((probe) => {
    return { time: probe.time, probe: probe.result }
  })
}
