# Database tools

## [MongoDB](https://www.mongodb.com/)

### GUI

As it offers a similar user experience than Mongo Atlas we prefer to use [Compass](https://www.mongodb.com/try/download/compass).

We previously also used [Robo 3T](https://robomongo.org/).

### Useful commands

Export a given collection from a given DB using a query in a JSON file: `mongoexport -d krawler-test -c world_cities_csv -q "{ 'properties.country': 'France' }" --jsonArray --out file.json`

Export a given collection from a given DB using a query in a CSV file: `mongoexport -d krawler-test -c world_cities_csv -q "{ 'properties.country': 'France' }" --type csv --fields properties.country,properties.pop --out file.csv`


