import _ from 'lodash'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { BadRequest } from '@feathersjs/errors'
import makeDebug from 'debug'

const debug = makeDebug('kdk:storage:service')

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/interfaces/_aws_sdk_types.requestpresigningarguments-1.html
const signingOptions = [
  'expiresIn',
  'signableHeaders',
  'signingDate',
  'signingRegion',
  'signingService',
  'unhoistableHeaders',
  'unsignableHeaders'
]

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
      return new S3Client(s3ClientConfig)
    },
    getKey (id) {
      let key = ''
      if (prefix) key += prefix + '/'
      if (context) key += context + '/'
      key += id
      return key
    },
    // Create a put signed url
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
      // Create the putCommand
      const putCommand = new PutObjectCommand({
        Key: this.getKey(data.id),
        Bucket: bucket
      })
      // Run the command
      const options = _.pick(data, signingOptions)
      const signedUrl = getSignedUrl(s3Client, putCommand, options)
      debug(`created put signed url: ${signedUrl}`)
      return {
        id: data.id,
        signedUrl
      }
    },
    // get a get signed url
    get (id, data, params) {
      if (!id) throw new BadRequest('get: expected missing \'id\' parameter')
      // Check data object
      if (data.Key) throw new BadRequest('get: unexpected \'Key\' parameter')
      debug(`storage service called for get ${id}`)
      // Create s3 client
      const s3Client = this.createS3Client(params)
      if (!s3Client) throw new BadRequest('get: invalid S3 credentials')
      // Set the parameters
      data.Key = this.getKey(id)
      data.Bucket = bucket
      // Create the getCommand
      const getCommand = new GetObjectCommand({
        Key: this.getKey(id),
        Bucket: bucket
      })
      // Run the command
      const options = _.pick(data, signingOptions)
      const signedUrl = getSignedUrl(s3Client, getCommand, options)
      debug(`created get signed url: ${signedUrl}`)
      return signedUrl
    },
    // Used to perform service actions such as remove a customer/subscription
    async remove (id, params) {
      if (!id) throw new BadRequest('get: expected missing \'id\' parameter')
      debug(`storage service called for remove ${id}`)
      // Create s3 client
      const s3Client = this.createS3Client(params)
      if (!s3Client) throw new BadRequest('get: invalid S3 credentials')
      // Create the deleteCommand
      const deleteCommand = new DeleteObjectCommand({
        Key: this.getKey(id),
        Bucket: bucket
      })
      // Run the command
      return await s3Client.send(deleteCommand)
    }
  }
}
