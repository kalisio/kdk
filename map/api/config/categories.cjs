const makeDebug = require('debug')
const debug = makeDebug('kdk:map:config:categories')

module.exports = function (categoryFiles, context) {
  // Request categories definition files
  debug('Processing the following category definition files to build catalog from', categoryFiles)

  // Process them
  let categories = []
  categoryFiles.forEach(categoryFile => {
    let categoriesFromFile
    try {
      categoriesFromFile = require(categoryFile)
    } catch (error) {
      console.error(error)
    }
    // Categories provided through a generation function ?
    if (typeof categoriesFromFile === 'function') categoriesFromFile = categoriesFromFile(context)
    // Categories directly provided as array or object
    else if (!Array.isArray(categoriesFromFile)) categoriesFromFile = [categoriesFromFile]
    categories = categories.concat(categoriesFromFile)
  })
  debug(`Found ${categories.length} category definitions to build catalog from`)

  // All categories by default
  let filter = categories.map(category => category.name.replace('Categories.', ''))
  // Now build filter according any env filter
  // Check for wildcard to get all categories
  if (process.env.CATEGORIES_FILTER && (process.env.CATEGORIES_FILTER !== '*')) {
    // Check for list with separator, whitespace or comma is supported
    if (process.env.CATEGORIES_FILTER.includes(',')) filter = process.env.CATEGORIES_FILTER.split(',')
    else filter = process.env.CATEGORIES_FILTER.split(' ')
  }
  // Now filter categories
  // Manage translation keys starting with 'Categories.'
  debug('Applying category filter', filter)
  return categories.filter(category => {
    const isFiltered = !filter.includes(category.name.replace('Categories.', ''))
    if (isFiltered) debug(`Filtering ${category.name} from catalog`)
    return !isFiltered
  })
}
