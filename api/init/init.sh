mongoimport --db cinemaAPP_DATA --collection demoapp_movies --drop --file /docker-entrypoint-initdb.d/demoapp_movies.json --jsonArray
mongoimport --db cinemaAPP_DATA --collection demoapp_favourites --drop --file /docker-entrypoint-initdb.d/demoapp_favourites.json --jsonArray
mongoimport --db cinemaAPP_DATA --collection demoapp_cinemas --drop --file /docker-entrypoint-initdb.d/demoapp_cinemas.json --jsonArray
mongoimport --db cinemaAPP_DATA --collection demoapp_checksub --drop --file /docker-entrypoint-initdb.d/demoapp_checksub.json --jsonArray
