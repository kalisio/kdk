// The loaders are taken from the source CommonJS entry point of @kalisio/kdk-map-api as they
// dynamically require the given definition files, which cannot work once bundled
const { loadCategories, loadLayers, loadSublegends } = require('@kalisio/kdk-map-api/config')

module.exports = {
	getCategories: loadCategories,
	getLayers: loadLayers,
	getSublegends: loadSublegends
}
