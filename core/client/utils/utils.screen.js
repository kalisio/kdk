import _ from 'lodash'
import logger from 'loglevel'
import { toRef } from 'vue'
import { Screen } from 'quasar'
import { AppFullscreen } from 'quasar'

export const Fullscreen = toRef(AppFullscreen, 'isActive')

export function computeResponsiveWidth (width) {
  if (_.isNumber(width)) {
    if (width > 100) return width
    return Screen.width * width / 100
  }
  if (!_.isObject(width)) {
    logger.warn(`[KDK] Invalid width parameter ${width}`)
    return undefined
  }
  let breakpointWidth = _.get(width, Screen.name)
  if (!breakpointWidth) {
    logger.warn(`[KDK] Cannot find width value for breakpoint ${Screen.name}`)
    return undefined
  }
  if (!_.isNumber(breakpointWidth)) {
    logger.warn(`[KDK] Invalid width value ${breakpointWidth} for breakpoint ${Screen.name}`)
    return undefined
  }
  return computeResponsiveWidth(breakpointWidth)
}

export function computeResponsiveHeight (height) {
  if (_.isNumber(height)) {
    if (height > 100) return height
    return Screen.height * height / 100
  }
  if (!_.isObject(height)) {
    logger.warn(`[KDK] Invalid height parameter ${height}`)
    return undefined
  }
  let breakpointHeight = _.get(height, Screen.name)
  if (!breakpointHeight) {
    logger.warn(`[KDK] Cannot find height value for breakpoint ${Screen.name}`)
    return undefined
  }
  if (!_.isNumber(breakpointHeight)) {
    logger.warn(`[KDK] Invalid height value ${breakpointHeight} for breakpoint ${Screen.name}`)
    return undefined
  }
  return computeResponsiveHeight(breakpointHeight)
}

export function computeResponsiveSize (size) {
  if (_.isArray(size)) {
    if (size.length === 2) {
      logger.warn(`[KDK] Invalid size parameter ${size}`)
      return undefined
    }
    return size
  }
  if (!_.isObject(size)) {
    logger.warn(`[KDK] Invalid size parameter ${size}`)
    return undefined
  }
  let breakpointSize = _.get(size, Screen.name)
  return [computeResponsiveWidth(breakpointSize[0]), computeResponsiveHeight(breakpointSize[1])]
}

export function getOrientation () {
  return Screen.width > Screen.height ? 'portrait' : 'landscape'
}

export async function toggleFullscreen () {
  return new Promise((resolve, reject) => {
    AppFullscreen.toggle()
      .then(() => {
        resolve(true)
      })
      .catch(err => {
        logger.warn(`[KDK] Cannot toggle fullscreen mode: ${err}`)
        reject(false)
      })
  })
}

export async function lockOrientation (orientation) {
  if (screen.orientation && screen.orientation.lock && (typeof screen.orientation.lock === 'function')) await screen.orientation.lock(orientation)
}
