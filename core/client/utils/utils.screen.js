import _ from 'lodash'
import logger from 'loglevel'
import { toRef } from 'vue'
import { Screen } from 'quasar'
import { AppFullscreen } from 'quasar'

export const Fullscreen = toRef(AppFullscreen, 'isActive')

export function computeResponsiveWidth (width) {
  let breakpointWidth = width
  if (typeof width === 'object') {
    breakpointWidth = _.get(width, Screen.name)
    if (!breakpointWidth) {
      logger.warn(`[KDK] Cannot find width value for breakpoint ${Screen.name}`)
      return 0
    }
  }
  if (!_.isNumber(breakpointWidth) && (breakpointWidth < 0) && (breakpointWidth > 100)) {
    logger.warn(`[KDK] Invalid parameter ${breakpointWidth}`)
    return 0
  }
  return Screen.width * breakpointWidth / 100
}

export function computeResponsiveHeight (height) {
  let breakpointHeight = height
  if (typeof breakpointHeight === 'object') {
    breakpointHeight = _.get(height, Screen.name)
    if (!breakpointHeight) {
      logger.warn(`[KDK] Cannot find width value for breakpoint ${Screen.name}`)
      return 0
    }
  }
  if (!_.isNumber(breakpointHeight) && (breakpointHeight < 0) && (breakpointHeight > 100)) {
    logger.warn(`[KDK] Invalid value ${breakpointHeight}`)
    return 0
  }
  return Screen.height * breakpointHeight / 100
}

export function computeResponsiveSize (size) {
  let breakpointSize = size
  if (typeof size === 'object') {
    breakpointSize = _.get(size, Screen.name)
    if (!breakpointSize) {
      logger.warn(`[KDK] Cannot find size value for breakpoint ${Screen.name}`)
      return [0, 0]
    }
  }
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