import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'

export const Broadcaster = {
  initialize () {
    this.channelName = _.kebabCase(_.get(config, 'appName', 'kdk'))
    this.channel = new BroadcastChannel(this.channelName)
    logger.debug(`[KDK] Broadcaster initialized with channel '${this.channelName}'`)
  },
  getChannelName () {
    return this.channelName
  },
  getChannel () {
    return this.channel
  },
  post (message) {
    this.channel.postMessage(message)
  }
}
