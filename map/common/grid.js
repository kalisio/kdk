import { grid } from '@kalisio/kdk-map-common'

// map/client deep-imports this file directly rather than going through index.js, and
// @kalisio/kdk-map-common only exposes these as members of its 'grid' namespace object -
// re-export them as named bindings here, preserving the same live gridSourceFactories
// registry the package's own index.js populates on import.
export const {
  SortOrder,
  gridSourceFactories,
  unitConverters,
  toHalf,
  BaseGrid,
  GridSource,
  makeGridSource,
  extractGridSourceConfig,
  Grid1D,
  Grid2D,
  TiledGrid,
  SubGrid
} = grid
