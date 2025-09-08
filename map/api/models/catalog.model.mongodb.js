import _ from 'lodash'

export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('catalog')
  // We previously had a unique constraint on name but we now have
  // different object types stored and we'd like a unique constraint per type
  options.Model.indexExists('name_1').then(() => options.Model.dropIndex('name_1')).catch(() => {})
  options.Model.indexExists('type_1').then(() => options.Model.dropIndex('type_1')).catch(() => {})
  // We also previously not take collation into account
  options.Model.indexExists('name_1_type_1').then(() => options.Model.dropIndex('name_1_type_1')).catch(() => {})
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  const languages = ['en', 'fr']
  const createCollationIndex = (name, language) => {
    return options.Model.createIndex({ name: 1, type: 1 }, { name, collation: { locale: language, strength: 1 } })
  }
  // We previously had a unique constraint that we have relaxed on collation index, check if we need to update
  options.Model.indexInformation({ full: true }).then(indexes => {
    for (let i = 0; i < languages.length; i++) {
      const language = languages[i]
      const name = `name-type-${language}`
      
      let uniqueIndex = _.find(indexes, { name, unique: true })
      if (uniqueIndex) options.Model.dropIndex(name).then(() => createCollationIndex(name, language)).catch(() => {})
      else createCollationIndex(name, language)
    }
  }).catch(error => {
    if (error.codeName === 'NamespaceNotFound') {
      // Could be that DB is not yet initialized, in this case simply create new collation index
      for (let i = 0; i < languages.length; i++) {
        const language = languages[i]
        const name = `name-type-${language}`
        createCollationIndex(name, language)
      }
    }
  })
  options.Model.createIndex({ name: 'text', label: 'text' })
}
