Vue.component('card', window.httpVueLoader('/static/scripts/components/movie.vue'))
Vue.component('v-model-select', window.httpVueLoader('/static/scripts/components/costumSearch.vue'))


new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    data() {
        return {
            movies: [],
            token: null,
            userid1: '',
            favorites: [],
            subs: [],
            search: '',
            searchCategory: '',
            searchCinema: '',
            searchStartDate: '',
            searchEndDate: '',
            favID: '',
            show_costum_search: false,
            loading: true,
        }
    },
    methods: {
        async fetchApi() {
            const byStartDate = (movies) => {
                const movieStartDate = movies.STARTDATE;

                return (
                    movieStartDate >= this.searchStartDate);
            };

            const byEndDate = (movies) => {
                const movieEndDate = movies.ENDDATE;

                return (
                    movieEndDate >= this.searchEndDate);
            };
            const auth_token = this.token
            // console.log(auth_token)

            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
            await axios.get('http://172.18.1.8:7000/movie')
                .then((response) => {


                    if (this.search || this.searchCategory || this.searchCinema || this.searchStartDate || this.searchEndDate) {

                        this.movies = response.data,
                            this.movies = this.movies.filter(movies =>
                                movies.CATEGORY.toLowerCase().includes(this.searchCategory.toLowerCase())
                                && movies.TITLE.toLowerCase().includes(this.search.toLowerCase())
                                && movies.CINEMANAME.toLowerCase().includes(this.searchCinema.toLowerCase())
                                && movies.CINEMANAME.toLowerCase().includes(this.searchCinema.toLowerCase())
                            )
                        this.movies = this.movies.filter(byStartDate)
                        this.movies = this.movies.filter(byEndDate)

                    } else {
                        this.movies = response.data
                    }

                    this.loadUSersFavourites()
                    this.loadUSersSubs()

                }
                ).catch((error) => {
                    console.error(error)
                })
            this.loading = false
        },

        searchByName() {
            this.fetchApi()
        },

        searchByCinemaName(passedData) {
            this.searchCinema = passedData
            this.fetchApi()
        },

        searchByStartDate(passedData) {
            this.searchStartDate = passedData
            this.fetchApi()
        },

        searchByEndDate(passedData) {
            this.searchEndDate = passedData
            this.fetchApi()
        },

        async initializeData() {
            const auth_token = this.token

            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
            await axios.get('http://172.18.1.8:7000/favorite')
                .then((response) => {
                    this.favorites = response.data.filter(favorites =>
                        favorites.USERID.toLowerCase().includes(this.userid1.toLowerCase()))
                }
                ).catch((error) => {
                    console.error(error)
                })

            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
            await axios.get('http://172.18.1.8:7000/checksub/' + this.userid1)
                .then((response) => {
                    this.subs = response.data
                }
                ).catch((error) => {
                    console.error(error)
                })


            this.fetchApi()
        },
        testMethod(passeDATA) {
            this.searchCategory = passeDATA,
                this.fetchApi()
        },
        cinemaSearch(passedData) {
            this.searchCinema = passedData,
                this.fetchApi()

        },

        async addToFav(passedData) {

            const auth_token = this.token
            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests

            const body = {
                "USERID": this.userid1,
                "MOVIEID": passedData
            }
            await axios.post('http://172.18.1.8:7000/favorite', body)
                .then((response) => {


                    // save favourite ID
                    for (var k = 0; k < this.movies.length; k++) {
                        if (passedData == this.movies[k]._id) {
                            this.movies[k].favID = response.data
                            this.movies[k].isFav = true
                            break;

                        }
                    }
                }
                )
                .catch((error) => {
                    console.error(error)
                    return false
                })
            return 'ok';

        },


        async addToSub(data) {
            let movieid = data.movieid

            let added = false
            const auth_token = this.token
            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
            let body =
            {
                "description": this.userid1,

                "subject": {
                    "entities": [
                        {
                            "id": movieid,
                            "type": "Movie"
                        }
                    ],
                    "condition": {
                        "attrs": [
                            "start_date",
                            "end_date",
                            "cinema",
                            "movie_name"

                        ]
                    }
                },
                "notification": {
                    "http": {
                        "url": "http://172.18.1.9:80/sub/" + this.userid1
                    },
                    "attrs": [
                        "start_date",
                        "end_date",
                        "cinema",
                        "movie_name"
                    ]
                },
                "expires": "2040-01-01T14:00:00.00Z",
                "throttling": 5
            }
            let subid = ''
            await axios.post('http://172.18.1.12:1026/v2/subscriptions/', body)
                .then((response) => {
                    subid = response.headers.location
                    subid = subid.substr(18, 30)
                    console.log(subid)
                    added = true
                    for (var k = 0; k < this.movies.length; k++) {
                        if (movieid == this.movies[k]._id) {
                            this.subID
                            this.movies[k].isSub = true
                            break;
                        }
                    }

                }
                )
                .catch((error) => {
                    console.error(error)
                    return false
                })

            if (added) {
                body = {
                    "userid": this.userid1,
                    "movieid": movieid,
                    "moviename": data.moviename,
                    "start_date": data.startdate,
                    "end_date": data.enddate,
                    "cinema": data.cinema,
                    "subid": subid
                }
                await axios.post('http://172.18.1.8:7000/checksub/', body)
                    .then((response) => {
                        this.subs.push(response.data)
                        for (var k = 0; k < this.movies.length; k++) {
                            if (movieid == this.movies[k]._id) {
                                this.movies[k].subID = response.data.subid
                                break;

                            }
                        }

                    }
                    )
                    .catch((error) => {
                        console.error(error)
                        return false
                    })


            }
        },



        async removeFromFav(passedData1) {
            //Find Favid
            let favIDtoDelete = ''
            for (var i in this.movies) {
                if (this.movies[i]._id == passedData1) {
                    favIDtoDelete = this.movies[i].favID
                    break; //Stop this loop, we found it!
                }
            }
            const auth_token = this.token
            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
            await axios.delete('http://172.18.1.8:7000/favorite/' + favIDtoDelete)
                .then((response) => {
                    return true
                }
                ).catch((error) => {
                    console.error(error.response.data)
                    return false
                })

        },



        async removeFromSub(passedData1) {
            //Delete from ORION

            //Find Subid
            let subIDtoDelete = ''
            for (var i in this.movies) {
                if (this.movies[i]._id == passedData1) {
                    subIDtoDelete = this.movies[i].subID
                    break; //Stop this loop, we found it!
                }
            }
            const auth_token = this.token
            axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
            await axios.delete('http://172.18.1.13:3005//v2/subscriptions/' + subIDtoDelete)
                .then((response) => {
                    console.log("Deleted from Orion")
                    return true
                }
                ).catch((error) => {
                    console.error(error.response.data)
                    return false
                })

            //DELETE FROM DB
            await axios.delete('http://172.18.1.8:7000/checksub/' + subIDtoDelete)
                .then((response) => {
                    return true
                }
                ).catch((error) => {
                    console.error(error.response.data)
                    return false
                })
            //DELETE subs (post updates)
            await axios.delete('http://172.18.1.8:7000/sub/' + subIDtoDelete)
                .then((response) => {
                    console.log(response.data)
                    return true
                }
                ).catch((error) => {
                    console.error(error.response.data)
                    return false
                })

        },


        loadUSersFavourites() {
            for (var j = 0; j < this.movies.length; j++) {
                for (var k = 0; k < this.favorites.length; k++) {
                    let fav_mov_ID = this.favorites[k].MOVIEID;
                    if (fav_mov_ID == this.movies[j]._id) {
                        this.movies[j].isFav = true
                        this.movies[j].favID = this.favorites[k]._id
                        break;
                    } else {
                        this.movies[j].isFav = false
                    }

                }
            }
        },

        loadUSersSubs() {
            for (var j = 0; j < this.movies.length; j++) {
                for (var k = 0; k < this.subs.length; k++) {
                    let sub_mov_id = this.subs[k].movieid


                    if (sub_mov_id == this.movies[j]._id) {
                        this.movies[j].isSub = true
                        this.movies[j].subID = this.subs[k].subid
                        break;
                    } else {
                        this.movies[j].isSub = false
                    }

                }
            }
        }


    },
    beforeMount() {
        this.token = document.getElementsByTagName('body')[0].getAttribute('token') || '{}'
        this.userid1 = document.getElementsByTagName('body')[0].getAttribute('userid') || '{}'

    },
    mounted() {
        this.initializeData()


    }
})
