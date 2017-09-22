# OpenStreetMap

The generation is based on the [OpenMapTiles](https://github.com/openmaptiles/openmaptiles) project toolbox.

To generate OSM data we start from a fresh Scaleway server with a Docker image, it already contains docker, git, pip, gcc, etc.

Git clone using HTTPS instead of git protocol on Scaleway.

We use the [quickstart script](https://github.com/openmaptiles/openmaptiles/blob/master/QUICKSTART.md) to generate data (the link contains useful information about required architecture/sizing):
```
git clone https://github.com/openmaptiles/openmaptiles
cd openmaptiles
make
./quickstart.sh france // could be planet, etc.
```
