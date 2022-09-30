import _ from 'lodash'
import path from 'path-browserify'
import logger from 'loglevel'
import shp from 'shpjs'
import { i18n } from '../../../core/client/i18n.js'

export const SHPReader = {
  async read (files, options) {
    if (files.length < 1 || files.length > this.getAdditionalFiles().length + 1) {
      logger.info('invalid \'files\' arguments')
      return
    }
    const promises = []
    const shpFile = files[0]
    promises.push(new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        logger.debug(error)
        reject(new Error(i18n.t('errors.CANNOT_READ_FILE', { file: shpFile.name }), { errors: error }))
      }
      reader.readAsArrayBuffer(shpFile)
    }))
    const prjFile = _.find(files, file => path.extname(file.name) === '.prj')
    if (prjFile) {
      promises.push(new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result)
        }
        reader.onerror = (error) => {
          logger.debug(error)
          reject(new Error(i18n.t('errors.CANNOT_READ_FILE', { file: prjFile.name }), { errors: error }))
        }
        reader.readAsText(prjFile)
      }))
    }
    const dbfFile = _.find(files, file => path.extname(file.name) === '.dbf')
    if (dbfFile) {
      promises.push(new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result)
        }
        reader.onerror = (error) => {
          logger.debug(error)
          reject(new Error(i18n.t('errors.CANNOT_READ_FILE', { file: dbfFile.name }), { errors: error }))
        }
        reader.readAsArrayBuffer(dbfFile)
      }))
    }
    // resolver the promises
    const buffers = await Promise.all(promises)
    // parse the buffers to return the geosjon content
    // ff a dbFile is defined it returns a FeatureCollection
    if (dbfFile) {
      if (prjFile) return shp.combine([shp.parseShp(buffers[0], buffers[1]), shp.parseDbf(buffers[2])])
      return shp.combine([shp.parseShp(buffers[0]), shp.parseDbf(buffers[1])])
    }
    // otherwise it returns an array of geometries that we need to convert to a FeatureCollection
    let content
    if (prjFile) content = shp.parseShp(buffers[0], buffers[1])
    content = shp.parseShp(buffers[0])
    const geoJson = {
      type: 'FeatureCollection',
      features: []
    }
    _.forEach(content, geometry => {
      geoJson.features.push({
        type: 'Feature',
        properties: {},
        geometry
      })
    })
    return geoJson
  },
  getAdditionalFiles () {
    return ['.dbf', '.prj', '.shx', '.cpg']
  }
}
