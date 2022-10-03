import makeDebug from 'debug'
import _ from 'lodash'
import aws from 'aws-sdk'
import { BadRequest } from '@feathersjs/errors'

const debug = makeDebug('kdk:storage:service')

export default function (name, app, options) {
  // Check options
  const bucket = options.bucket || app.get('storage').bucket
  if (!bucket) throw new Error('A bucket must be specified to crate a storage service')
  const prefix = options.prefix || app.get('storage').prefix
  const context = options.context
  return {
    createS3Client (params) {
      debug('create S3 client')
      const s3ClientConfig = Object.assign({}, app.get('storage').client, params)
      return new aws.S3(s3ClientConfig)
    },
    getKey (id) {
      let key = ''
      if (prefix) key += prefix + '/'
      if (context) key += context + '/'
      key += id
      return key
    },
    // Used to perform service actions such as create a customer/subscription.
    create (data, params) {
      // Check data object
      if (data.Key) throw new BadRequest('get: unexpected \'Key\' parameter')
      if (!data.id) throw new BadRequest('get: missing \'id\' parameter')
      debug(`storage service called for create ${data.id}`)
      // Create s3 client
      const s3Client = this.createS3Client(params)
      if (!s3Client) throw new BadRequest('get: invalid S3 credentials')
      // Set the parameters
      data.Key = this.getKey(data.id)
      data.Bucket = bucket
      // Create the signed url
      const signedUrl = s3Client.getSignedUrl('putObject', _.omit(data, ['buffer', 'id']))
      debug(`created put signed url: ${signedUrl}`)
      return {
        id: data.id,
        signedUrl
      }
    },
    // Used to perform service actions such as update a customer/subscription
    get (id, data, params) {
      // Check data object
      if (data.Key) throw new BadRequest('get: unexpected \'Key\' parameter')
      debug(`storage service called for get ${id}`)
      // Create s3 client
      const s3Client = this.createS3Client(params)
      if (!s3Client) throw new BadRequest('get: invalid S3 credentials')
      // Set the parameters
      data.Key = this.getKey(id)
      data.Bucket = bucket
      // Create the signed url
      const signedUrl = s3Client.getSignedUrl('getObject', data)
      debug(`created get signed url: ${signedUrl}`)
      return signedUrl
    },
    // Used to perform service actions such as remove a customer/subscription
    async remove (id, params) {
      debug(`storage service called for remove ${id}`)
    }
  }
}
