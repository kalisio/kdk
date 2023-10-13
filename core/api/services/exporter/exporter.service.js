import _ from 'lodash'
import fs from 'fs-extra'
import zlib from 'zlib'
import makeDebug from 'debug'
import JSONExporter from './exporter.json.js'
import CSVExporter from './exporter.csv.js'

const debug = makeDebug('kdk:exporter:service')

/*
 Helper function that write a buffer to a stream with zip compression or not
 */
function write (stream, buffer, zip) {
  if (buffer) {
    if (zip) {
      zlib.gzip(buffer, (error, zippedBuffer) => { 
        if (!error) stream.write(zippedBuffer)
        else console.error(error)
      })
    } else {
      stream.write(buffer)
    }
  }
}

class ExporterService {
  constructor (options, app) {
    this.app = app
    this.exporters = {
      'json': JSONExporter,
      'csv': CSVExporter
    }
  }

  register (format, exporter) {
    this.exporters[format] = exporter
  }

  async create(data, params) {
    // Retrieve export options
    const { serviceName } = data
    const serviceContext = _.get(data, 'serviceContext')
    const dataQuery = _.get(data, 'dataQuery', {})
    const batchSize = _.get(data, 'batchSize', 500)
    const outputFormat = _.get(data, 'outputFormat', 'json')
    const exporter = _.get(this.exporters, outputFormat)
    if (!exporter) throw new Error("Invalid format")
    const zipOutput = _.get(data, 'zipOutput', false)
    // Retrieve the service to be requested
    const service = this.app.getService(serviceName, serviceContext)
    // Define ouputfile and the corresonding stream
    let outputFile = `${serviceName}.${outputFormat}`
    if (zipOutput) outputFile += '.gz'
    let outputSteam = fs.createWriteStream(outputFile)
    // Setup the process info object
    let response = await service._find({ query: Object.assign(dataQuery, { $limit: 0 }) })
    const info = {
      currentBatch: 0,
      batchSize,
      nbBatches: Math.round(response.total / batchSize)
    }
    debug(`Exporting ${response.total} objects in ${info.nbBatches} batches of size of ${batchSize} objects`)
    // Begin the process
    write(outputSteam, exporter.begin(info), zipOutput)
    // Process batches
    while (info.currentBatch < info.nbBatches) {
      response = await service._find({ query: Object.assign(dataQuery, { $limit: batchSize, $skip: info.currentBatch * info.batchSize }) })
      write(outputSteam, exporter.process(info, response.data), zipOutput)
      info.currentBatch++
    }
    // End the process
    write(outputSteam, exporter.end(info), zipOutput)
  }
}

export default function (name, app, options) {
  return new ExporterService(options, app)
}