# OpenStreetMap

The generation is based on the [OpenMapTiles](https://github.com/openmaptiles/openmaptiles) project toolbox.

To generate OSM data we start from a fresh Scaleway server with a Docker image, it already contains docker, git, pip, gcc, etc.

> Git clone using HTTPS instead of git protocol on Scaleway.

Because you will need a lot of storage here is how to add a volume:
``` bash
mkfs -t ext4 /dev/nbd1
mkdir -p /mnt/data
mount /dev/nbd1 /mnt/data
```
To automount it: https://community.online.net/t/automatic-mounting-of-additional-volumes-using-systemd-on-ubuntu/3102

Rendering the whole planet is a [tricky thing](https://github.com/openmaptiles/openmaptiles/issues/242), so for now we prefer to:
* contribute with a Pull Request to the community maintained open-source official vector tile schema so that the changes will be part of the future public OpenMapTiles releases and maintained
* render only the features needed into a separate MBTiles files with new layers - and combine the standard planet with the extra layers - this is doable easily with JSON GL style and software stack powered by mapnik or tippecanoe.
* the extra layers can be also generated on demand directly from PostGIS by a third party tileservers and combined into a single map with TileServer GL - and served via composed vector tiles or raster tiles
  * [GeoServer](http://geoserver.org/) as vector/raster tiles
  * [Tegola](https://github.com/terranodo/tegola) directly as MVT
  * [T-Rex](https://github.com/t-rex-tileserver/t-rex) directly as MVT

For small extractions it's possible to use the [OverPass API](http://overpass-turbo.eu/), eg to extract taxiways/runways in a zone:
```
[out:json][timeout:25];
// gather results
(
  // query part for: “aeroway=runway”
  node["aeroway"="runway"]({{bbox}});
  way["aeroway"="runway"]({{bbox}});
  relation["aeroway"="runway"]({{bbox}});
  // query part for: “aeroway=taxiway”
  node["aeroway"="taxiway"]({{bbox}});
  way["aeroway"="taxiway"]({{bbox}});
  relation["aeroway"="taxiway"]({{bbox}});
);
// print results
out body;
>;
out skel qt;
```

We also use the [quickstart script](https://github.com/openmaptiles/openmaptiles/blob/master/QUICKSTART.md) to generate data (the link contains useful information about required architecture/sizing):
```
git clone https://github.com/openmaptiles/openmaptiles
cd openmaptiles
make
./quickstart.sh france // could be country, region, etc. but not planet
```

For a layer covering the planet first download the [whole planet](https://planet.openstreetmap.org/pbf/) in the *data* directory and launch the process:
```
cd data
wget https://planet.openstreetmap.org/pbf/planet-latest.osm.pbf
mv planet-latest.osm.pbf planet.osm.pbf
cd ..
./quickstart.sh planet
```

Here is a list of interesting documentation:
* [kloklantech thesis](./Updatable%20Vector%20Tiles%20from%20OpenStreetMap.pdf) detailing the whole toolchain
* [tutorial video](http://fuzzytolerance.info/blog/2017/04/25/Generating-your-own-OpenMapTiles/)
* [mapbox presentation](https://www.youtube.com/watch?v=D7mmXonFIqA&feature=youtu.be)
