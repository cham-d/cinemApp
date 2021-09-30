FROM mongo

COPY demoapp_movies.js /demoapp_movies.js
CMD mongoimport --host mongodb --db reach-engine --collection demoapp_movies --type json --file /init.json --jsonArray

