import _ from 'lodash'

export default async function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('catalog')
  // We previously had a unique constraint on name but we now have
  // different object types stored and we'd like a unique constraint per type
  try {
    await options.Model.dropIndex('name_1')
  } catch (_) {}
  try {
    await options.Model.dropIndex('type_1')
  } catch (_) {}
  // We also previously not take collation into account
  try {
    await options.Model.dropIndex('name_1_type_1')
  } catch (_) {}
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  const languages = ['en', 'fr']
  const createCollationIndex = (name, language) => options.Model.createIndex(
    { name: 1, type: 1 },
    { name, collation: { locale: language, strength: 1 } }
  )
  // We previously had a unique constraint that we have relaxed on collation index, check if we need to update
  let indexes = []
  try {
    indexes = await options.Model.indexInformation({ full: true })
  } catch (error) {
    if (error.codeName !== 'NamespaceNotFound') throw error
  }
  await Promise.all(languages.map(async language => {
    const name = `name-type-${language}`
    const uniqueIndex = _.find(indexes, { name, unique: true })
    if (uniqueIndex) {
      try {
        await options.Model.dropIndex(name)
        await createCollationIndex(name, language)
      } catch (_) {}
    } else {
      await createCollationIndex(name, language)
    }
  }))
  await options.Model.createIndex({ name: 'text', label: 'text' })
}
