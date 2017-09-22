# OpenStreetMap

The generation is based on the [OpenMapTiles](https://github.com/openmaptiles/openmaptiles) project toolbox.

To generate OSM data we start from a fresh Scaleway server with a Docker image, it already contains docker, git, pip, gcc, etc.

> Git clone using HTTPS instead of git protocol on Scaleway.

We use the [quickstart script](https://github.com/openmaptiles/openmaptiles/blob/master/QUICKSTART.md) to generate data (the link contains useful information about required architecture/sizing):
```
git clone https://github.com/openmaptiles/openmaptiles
cd openmaptiles
make
./quickstart.sh france // could be planet, etc.
```

Rendering the whole planet is a [tricky thing](https://github.com/openmaptiles/openmaptiles/issues/242), so for now we prefer to:
* contribute with a Pull Request to the community maintained open-source official vector tile schema so that the changes will be part of the future public OpenMapTiles releases and maintained
* render only the features needed into a separate MBTiles files with new layers - and combine the standard planet with the extra layers - this is doable easily with JSON GL style and software stack powered by mapnik or tippecanoe.
* the extra layers can be also generated on demand directly from PostGIS by a third party tileservers and combined into a single map with TileServer GL - and served via composed vector tiles or raster tiles
  * [GeoServer](http://geoserver.org/) as vector/raster tiles
  * [Tegola](https://github.com/terranodo/tegola) directly as MVT
  * [T-Rex](https://github.com/t-rex-tileserver/t-rex) directly as MVT

Here is a list of interesting documentation:
* [kloklantech thesis](./Updatable%20Vector%20Tiles%20from%20OpenStreetMap.pdf)
* http://fuzzytolerance.info/blog/2017/04/25/Generating-your-own-OpenMapTiles/
* https://www.youtube.com/watch?v=D7mmXonFIqA&feature=youtu.be
