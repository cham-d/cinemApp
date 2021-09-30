mongoimport --db orion --collection csubs --drop --file /docker-entrypoint-initdb.d/csubs.json --jsonArray
mongoimport --db orion --collection entities --drop --file /docker-entrypoint-initdb.d/entities.json --jsonArray
