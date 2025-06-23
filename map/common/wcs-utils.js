import _ from 'lodash'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common/index.js'

// https://www.opengeospatial.org/standards/wcs

export function fetchAsJson (query, headers = {}) {
  return fetch(query, { redirect: 'follow', headers })
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

export async function GetCapabilities (url, searchParams = {}, headers = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WCS',
    REQUEST: 'GetCapabilities'
  }, searchParams))
  return fetchAsJson(query, headers)
}

export async function DescribeCoverage (url, version, coverage, searchParams = {}, headers = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WCS',
    VERSION: version,
    REQUEST: 'DescribeCoverage',
    COVERAGE: coverage
  }, searchParams))
  return fetchAsJson(query, headers)
}

export async function GetCoverage (abort, url, version, coverage, format, bbox, width, height, searchParams = {}, headers = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WCS',
    VERSION: version,
    REQUEST: 'GetCoverage',
    COVERAGE: coverage,
    CRS: 'EPSG:4326',
    BBOX: `${bbox.join(',')}`,
    WIDTH: width,
    HEIGHT: height,
    FORMAT: format
  }, searchParams))
  return fetch(query, { method: 'get', signal: abort, headers })
  // using a Blob is problematic with node.js since there's no support for it
  // instead use an ArrayBuffer
  // .then(response => response.blob())
    .then(response => response.arrayBuffer())
}

export function GetCoverageSpatialBounds (coverage) {
  // 1.0.0
  // CoverageDescription / CoverageOffering / lonLatEnvelope
  const envelope = _.get(coverage, 'CoverageDescription.CoverageOffering[0].lonLatEnvelope[0].pos', null)
  if (!envelope) { return null }
  // assume lat long & deg & srs = 4326
  // TODO: check it
  const lats = []
  const lons = []
  for (const p of envelope) {
    const lonLat = p.split(' ')
    lons.push(parseFloat(lonLat[0]))
    lats.push(parseFloat(lonLat[1]))
  }
  const minLatLon = [Math.min(...lats), Math.min(...lons)]
  const maxLatLon = [Math.max(...lats), Math.max(...lons)]
  return [minLatLon[0], minLatLon[1], maxLatLon[0], maxLatLon[1]]
}

export function GetSupportedFormats (coverage) {
  // 1.0.0
  // CoverageDescription / CoverageOffering / supportedFormats
  const root = _.get(coverage, 'CoverageDescription.CoverageOffering[0].supportedFormats[0]', null)
  // const nativ = _.get(root, '$.nativeFormat', null)
  const formats = _.get(root, 'formats')
  // TODO: put native format as first entry
  // MapServer nativeFormat='geotiff' but this is not listed in
  // formats list ...
  /*
    if (nativ && formats) {
    }
    */
  return formats
}

/*
export function makeGetCapabilitiesQuery(url) {
    return `${url}?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCapabilities`
}

export function makeDescribeCoverageQuery(url, coverage) {
    return `${url}?SERVICE=WCS&VERSION=2.0.1&REQUEST=DescribeCoverage&COVERAGEID=${coverage}`
}

export function makeGetCoverageQuery (url, coverage, format, subsets, scaleSizes) {
    let query = `${url}?SERVICE=WCS&VERSION=2.0.1&
REQUEST=GetCoverage&COVERAGEID=${coverage}&FORMAT=${format}`
    for (const subset of subsets) {
        query += `&SUBSET=${subset.axis}(${subset.low},${subset.high})`
    }
    if (scaleSizes) {
        query += `&SCALESIZE=${scaleSizes[0].axis}(${scaleSizes[0].size})`
        for (let i = 1; i < scaleSizes.length; ++i) {
            query += `,${scaleSizes[i].axis}(${scaleSizes[i].size})`
        }
    }
    return query
}

export async function GetCapabilities (url) {
    const query = makeGetCapabilitiesQuery(url)
    return fetch(query)
        .then(response => response.text())
        .then(txt => xml2js.parseStringPromise(txt))
}

export async function DescribeCoverage (url, coverage) {
    const query = makeDescribeCoverageQuery(url, coverage)
    return fetch(query)
        .then(response => response.text())
        .then(txt => xml2js.parseStringPromise(txt))
}

export async function GetCoverage (url, coverage, format, bbox, width, height, axisNames) {
    const subsets = [
        { axis: axisNames[0], low: bbox[0], high: bbox[2] }
        , { axis: axisNames[1], low: bbox[1], high: bbox[3] } ]
    const scaleSizes = [
        { axis: axisNames[0], size: height }
        , { axis: axisNames[1], size: width } ]
    const query = makeGetCoverageQuery(url, coverage, format, subsets, scaleSizes)
    return fetch(query)
        .then(response => response.blob())
}

export function GetSupportedFormats (capabilities) {
    // 2.0.1
    // wcs:Capabilities / wcs:ServiceMetadata / wcs:formatSupported
    return _.get(capabilities, 'wcs:Capabilities.wcs:ServiceMetadata[0].wcs:formatSupported', null)
}

export function GetOfferedCoverages (capabilities) {
    // 2.0.1
    // wcs:Capabilities / wcs:Contents / wcs:CoverageSummary / wcs:CoverageId
    const summary = _.get(capabilities, 'wcs:Capabilities.wcs:Contents[0].wcs:CoverageSummary')
    if (!summary)
        return null
    return summary.map(node => _.get(node, 'wcs:CoverageId[0]'))
}

export function GetCoverageSpatialBounds (coverage) {
    // 2.0.1
    // wcs:CoverageDescriptions / gml:boundedBy / gml:Envelope
    const envelope = _.get(coverage, 'wcs:CoverageDescriptions.wcs:CoverageDescription[0].gml:boundedBy[0].gml:Envelope[0]')
    if (!envelope)
        return null
    // assume lat long & deg & srs = 4326
    // TODO: check it
    const lowerCorner = _.get(envelope, 'gml:lowerCorner[0]', null)
    const upperCorner = _.get(envelope, 'gml:upperCorner[0]', null)
    if (!lowerCorner || !upperCorner)
        return null
    const minLatLon = lowerCorner.split(' ').map(val => parseFloat(val))
    const maxLatLon = upperCorner.split(' ').map(val => parseFloat(val))
    return [minLatLon[0], minLatLon[1], maxLatLon[0], maxLatLon[1]]
}
*/
