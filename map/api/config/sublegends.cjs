const makeDebug = require('debug')
const debug = makeDebug('kdk:map:config:sublegends')

module.exports = function (sublegendFiles, context) {
  // Request sublegends definition files
  debug('Processing the following legend definition files to build catalog from', sublegendFiles)

  // Process them
  let sublegends = []
  sublegendFiles.forEach(sublegendFile => {
    let sublegendsFromFile
    try {
      sublegendsFromFile = require(sublegendFile)
    } catch (error) {
      console.error(error)
    }
    // Sublegends provided through a generation function ?
    if (typeof sublegendsFromFile === 'function') sublegendsFromFile = sublegendsFromFile(context)
    // Sublegends directly provided as array or object
    else if (!Array.isArray(sublegendsFromFile)) sublegendsFromFile = [sublegendsFromFile]
    sublegends = sublegends.concat(sublegendsFromFile)
  })
  debug(`Found ${sublegends.length} sublegend definitions to build catalog from`)

  // All sublegends by default
  let filter = sublegends.map(sublegend => sublegend.name.replace('Sublegends.', ''))
  // Now build filter according any env filter
  // Check for wildcard to get all sublegends
  if (process.env.SUBLEGENDS_FILTER && (process.env.SUBLEGENDS_FILTER !== '*')) {
    // Check for list with separator, whitespace or comma is supported
    if (process.env.SUBLEGENDS_FILTER.includes(',')) filter = process.env.SUBLEGENDS_FILTER.split(',')
    else filter = process.env.SUBLEGENDS_FILTER.split(' ')
  }
  // Now filter sublegends
  // Manage translation keys starting with 'Sublegends.'
  debug('Applying legend filter', filter)
  return sublegends.filter(sublegend => {
    const isFiltered = !filter.includes(sublegend.name.replace('Sublegends.', ''))
    if (isFiltered) debug(`Filtering ${sublegend.name} from catalog`)
    return !isFiltered
  })
}
