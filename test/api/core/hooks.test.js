import { memory } from '@feathersjs/memory'
import assert from 'assert'
import chai from 'chai'
import chailint from 'chai-lint'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { kdk, hooks } from '../../../core/api/index.js'
import mongodb from 'mongodb'

const { ObjectID } = mongodb
const { util, expect } = chai

describe('core:hooks', () => {
  before(() => {
    chailint(chai, util)
  })

  it('sets expiry date', () => {
    const hook = {
      type: 'before',
      data: {},
      params: {}
    }
    hooks.setExpireAfter(7000)(hook)
    // Allow a difference of 1s due to execution time
    expect(Math.abs(hook.data.expireAt.getTime() - Date.now() - 7000000)).to.be.below(1000)
  })

  it('sets as deleted', () => {
    const hook = {
      type: 'before',
      data: {},
      params: {}
    }
    hooks.setAsDeleted(hook)
    expect(hook.data.deleted).beTrue()
  })

  it('converts dates', () => {
    const now = new Date()
    const hook = {
      type: 'before',
      data: { date: now.toISOString() },
      params: {}
    }
    hooks.convertDates(['date'])(hook)
    expect(typeof hook.data.date).to.equal('object')
    expect(hook.data.date.getTime()).to.equal(now.getTime())
  })

  it('converts object IDs', () => {
    const id = new ObjectID()
    const hook = {
      type: 'before',
      data: { id: id.toString() },
      params: { query: { id: id.toString() } }
    }
    hooks.convertObjectIDs(['id'])(hook)
    expect(ObjectID.isValid(hook.data.id)).beTrue()
    expect(hook.data.id.toString()).to.equal(id.toString())
    expect(ObjectID.isValid(hook.params.query.id)).beTrue()
    expect(hook.params.query.id.toString()).to.equal(id.toString())
  })

  it('process object IDs', () => {
    const id = new ObjectID()
    const anotherId = new ObjectID()
    const hook = {
      type: 'before',
      data: {
        'field._id': id.toString(),
        objects: [{
          _id: id.toString(), date: new Date(), string: 'transmission'
        }, {
          _id: anotherId, date: new Date()
        }],
        date: new Date()
      },
      params: {
        query: {
          _id: { $in: [id.toString()] },
          id: anotherId,
          tags: { $in: ['transmission'] },
          array: [new Date(), new Date()]
        }
      }
    }
    hooks.processObjectIDs(hook)
    // Ensure we do not destructure objects
    expect(Object.keys(hook.data)).to.deep.equal(['field._id', 'objects', 'date'])
    expect(hook.data.date instanceof Date).beTrue()
    expect(ObjectID.isValid(hook.data['field._id'])).beTrue()
    expect(hook.data['field._id'].toString()).to.equal(id.toString())
    expect(Array.isArray(hook.data.objects)).beTrue()
    expect(hook.data.objects.length).to.equal(2)
    let object = hook.data.objects[0]
    expect(Object.keys(object)).to.deep.equal(['_id', 'date', 'string'])
    expect(ObjectID.isValid(object._id)).beTrue()
    expect(object._id.toString()).to.equal(id.toString())
    expect(object.date instanceof Date).beTrue()
    expect(typeof object.string === 'string').beTrue()
    object = hook.data.objects[1]
    expect(Object.keys(object)).to.deep.equal(['_id', 'date'])
    expect(ObjectID.isValid(object._id)).beTrue()
    expect(object._id.toString()).to.equal(anotherId.toString())
    expect(object.date instanceof Date).beTrue()
    expect(Object.keys(hook.params.query)).to.deep.equal(['_id', 'id', 'tags', 'array'])
    expect(Array.isArray(hook.params.query.array)).beTrue()
    expect(hook.params.query.array.length).to.equal(2)
    hook.params.query.array.forEach(value => {
      expect(value instanceof Date).beTrue()
    })
    expect(ObjectID.isValid(hook.params.query._id.$in[0])).beTrue()
    expect(hook.params.query._id.$in[0].toString()).to.equal(id.toString())
    expect(ObjectID.isValid(hook.params.query.id)).beTrue()
    expect(hook.params.query.id.toString()).to.equal(anotherId.toString())
    expect(typeof hook.params.query.tags.$in[0] === 'string').beTrue()
  })

  it('check uniqueness', async () => {
    const service = memory({
      store: {
        0: { name: 'xxx' },
        1: { name: 'yyy' }
      },
      paginate: { default: 5, max: 5 }
    })
    const hook = {
      type: 'before',
      method: 'create',
      data: { name: 'xxx' },
      service
    }
    await hooks.checkUnique({ field: 'dummy' })(hook)
    let error
    try {
      await hooks.checkUnique({ field: 'name' })(hook)
    } catch (err) {
      error = err
    }
    expect(error).toExist()
    hook.method = 'patch'
    hook.id = 0
    await hooks.checkUnique({ field: 'dummy' })(hook)
    hook.id = 1
    try {
      await hooks.checkUnique({ field: 'name' })(hook)
    } catch (err) {
      error = err
    }
    expect(error).toExist()
  })

  it('prevent changes', async () => {
    const hook = {
      type: 'before',
      method: 'patch',
      data: {
        name: 'zzz',
        secret: 'xxx',
        anotherSecret: 'yyy'
      }
    }
    try {
      await hooks.preventChanges(true, ['secret'])(hook)
      assert.fail('preventChanges should raise on error')
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
    }

    try {
      await hooks.preventChanges(false, ['secret', 'anotherSecret'])(hook)
      expect(hook.data.name).to.equal('zzz')
      expect(hook.data.secret).beUndefined()
      expect(hook.data.anotherSecret).beUndefined()
    } catch (error) {
      assert.fail('preventChanges should not raise on error')
    }

    // Check with dot notation
    hook.data['secret.value'] = 'xxx'
    try {
      await hooks.preventChanges(false, ['secret'])(hook)
      expect(hook.data.name).to.equal('zzz')
      expect(hook.data.secret).beUndefined()
      expect(hook.data['secret.value']).beUndefined()
    } catch (error) {
      assert.fail('preventChanges should not raise on error')
    }
  })

  it('marshalls comparison queries', () => {
    const now = new Date()
    const hook = {
      type: 'before',
      params: {
        query: {
          number: { $gt: '0', $lt: '10' },
          date: { $gte: now.toISOString(), $lte: now.toISOString() }
        }
      }
    }
    hooks.marshallComparisonQuery(hook)
    expect(typeof hook.params.query.number.$gt).to.equal('number')
    expect(typeof hook.params.query.number.$lt).to.equal('number')
    expect(hook.params.query.number.$gt).to.equal(0)
    expect(hook.params.query.number.$lt).to.equal(10)
    expect(typeof hook.params.query.date.$gte).to.equal('object')
    expect(typeof hook.params.query.date.$lte).to.equal('object')
    expect(hook.params.query.date.$gte.getTime()).to.equal(now.getTime())
    expect(hook.params.query.date.$lte.getTime()).to.equal(now.getTime())
  })

  it('marshalls collation queries', () => {
    const hook = {
      type: 'before',
      params: { query: { $locale: 'fr' } }
    }
    hooks.marshallCollationQuery(hook)
    expect(hook.params.collation).toExist()
    expect(hook.params.query.$locale).beUndefined()
    expect(typeof hook.params.collation).to.equal('object')
    expect(hook.params.collation.locale).to.equal('fr')
  })

  it('marshalls HTTP queries', () => {
    const now = new Date()
    const datetime = now.toISOString()
    const notADateTime = datetime.replace('T', 'Z')
    const query = {
      booleanTrue: 'true',
      booleanFalse: 'false',
      notABoolean: 'falsy',
      number: '223',
      notANumber: '22E',
      datetime,
      notADateTime
    }
    const hook = {
      type: 'before',
      params: { provider: 'socketio', query }
    }
    // Nothing should happen with websocket provider
    hooks.marshallHttpQuery(hook)
    expect(hook.params.query).to.deep.equal(query)
    hook.params.provider = 'rest'
    hooks.marshallHttpQuery(hook)
    expect(hook.params.query.booleanTrue).to.equal(true)
    expect(hook.params.query.booleanFalse).to.equal(false)
    expect(hook.params.query.notABoolean).to.equal('falsy')
    expect(hook.params.query.number).to.equal(223)
    expect(hook.params.query.notANumber).to.equal('22E')
    expect(hook.params.query.datetime.valueOf()).to.equal(now.valueOf())
    expect(hook.params.query.notADateTime).to.equal(notADateTime)
  })

  it('diacristic search', () => {
    const hook = {
      type: 'before',
      params: {
        query: { name: { $search: 'are' } }
      }
    }
    fuzzySearch({ fields: ['name'] })(hook)
    expect(hook.params.query.name.$regex).toExist()
    expect(hook.params.query.name.$regex.source).to.equal('are')
    hooks.diacriticSearch()(hook)
    // Non-diacritic items are changed
    expect(hook.params.query.name.$regex.source).to.equal('[a,á,à,ä,â,ã]r[e,é,ë,è,ê]')
    // But not the other way araound by default
    hook.params.query.name = { $search: 'árë' }
    fuzzySearch({ fields: ['name'] })(hook)
    hooks.diacriticSearch()(hook)
    expect(hook.params.query.name.$regex.source).to.equal('árë')
  })

  it('rate limiting', (done) => {
    const limiter = hooks.rateLimit({ tokensPerInterval: 2, interval: 60 * 1000, method: 'create', service: 'service' }) // 2 per minute
    const hook = {
      type: 'before',
      method: 'create',
      data: {},
      params: {},
      service: { name: 'service' }
    }
    try {
      limiter(hook)
      hook.n = 1
      limiter(hook)
      hook.n = 2
      // Should rise after 2 calls
      limiter(hook)
      hook.n = 3
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('TooManyRequests')
      expect(hook.n).to.equal(2)
      done()
    }
  })

  it('count limiting', (done) => {
    const limiter = hooks.countLimit({ count: (hook) => hook.n, max: 1 })
    const hook = {
      type: 'before',
      method: 'create',
      data: {},
      params: {},
      service: { name: 'service' },
      n: 0
    }
    limiter(hook)
      .then(() => {
        hook.n = 1
        return limiter(hook)
      })
      .then(() => {
        hook.n = 2
        // Should rise after 2 calls
        return limiter(hook)
      })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        expect(hook.n).to.equal(2)
        done()
      })
  })

  it('generate JWT', async () => {
    const app = kdk()
    const config = app.get('authentication')
    const hook = {
      type: 'before',
      app,
      data: {},
      params: { user: { _id: 'toto' } }
    }
    await hooks.createJWT()(hook)
    expect(typeof hook.data.accessToken).to.equal('string')
    const payload = await app.getService('authentication').verifyAccessToken(hook.data.accessToken, config.jwtOptions)
    expect(payload.userId).beUndefined()
  })

  it('generate custom JWT', async () => {
    const app = kdk()
    const config = app.get('authentication')
    const hook = {
      type: 'before',
      app,
      data: {},
      params: { user: { _id: 'toto' } }
    }
    await hooks.createJWT({
      name: 'accessToken',
      jwt: user => ({ subject: user._id }),
      payload: user => ({ userId: user._id })
    })(hook)
    expect(typeof hook.data.accessToken).to.equal('string')
    const payload = await app.getService('authentication').verifyAccessToken(hook.data.accessToken, config.jwtOptions)
    expect(payload.sub).to.equal('toto')
    expect(payload.userId).to.equal('toto')
  })
})
