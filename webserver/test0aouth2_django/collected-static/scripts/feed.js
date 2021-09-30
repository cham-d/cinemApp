Vue.component('card', window.httpVueLoader('/static/scripts/components/feed.vue'))

new Vue({
     delimiters: ['[[', ']]'],
     el: '#app',
     data() {
          return {
               subs: [],
               startendnot: [],
               notifications: [],
               token: null,
               userid1: '',
               rendering: true,
               getMoviesDateChangesDone: false,
               moviesDates: [],
               getMovieNameDone: false,
               displayNotifications: []
          }
     },
     methods:
     {

          async initializeData() {
               this.getCurrentMovieDates()

          },


          async getCurrentMovieDates() {
               const auth_token = this.token
               axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
               await axios.get('http://172.18.1.8:7000/checksub/' + this.userid1)
                    .then((response) => {
                         this.moviesDates = response.data
                         this.checkDatesForNotifications()
                         this.getMoviesDateChanges()

                    }
                    ).catch((error) => {
                         console.error(error)
                    })

          },

          async getMoviesDateChanges() {
               let receivedata = ''
               const auth_token = this.token
               axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
               await axios.get('http://172.18.1.8:7000/sub/' + this.userid1)
                    .then((response) => {
                         receivedata = response.data
                         this.editResponseData(receivedata)

                    }
                    ).catch((error) => {
                         console.error(error)
                    })
          },

          async editResponseData(receive_data) {
               let notificationExists = false

               for (const element of receive_data) {

                    let dataparse = JSON.parse(element.data)
                    element.id = (dataparse[0].id)

                    let start_date = dataparse[0].start_date
                    let start_date_parse = JSON.parse(start_date)
                    let new_start_date = start_date_parse.value
                    element.new_start_date = new_start_date

                    let end_date = dataparse[0].end_date
                    let end_date_parse = JSON.parse(end_date)
                    let new_end_date = end_date_parse.value
                    element.new_end_date = new_end_date

                    let moviename = dataparse[0].movie_name
                    let moviename_parse = JSON.parse(moviename)
                    let new_moviename = moviename_parse.value
                    element.new_moviename = new_moviename

                    let cinema = dataparse[0].cinema
                    let cinema_parse = JSON.parse(cinema)
                    let new_cinema = cinema_parse.value
                    element.new_cinema = new_cinema
                    for (const movie of this.notifications) {
                         if (movie.movieid == element.id) //if notification already exists,change it
                         {

                              notificationExists = true
                              if (movie.start_date != element.new_start_date) {
                                   movie.start_date = element.new_start_date
                              }
                              if (movie.end_date != element.new_end_date) {
                                   movie.end_date = element.new_end_date
                              }

                              movie.title = element.new_moviename
                              movie.cinema = element.new_cinema
                         }
                    }
               }
               this.calculateDisplayNotifications()
          },

          checkDatesForNotifications() {
               for (const movie of this.moviesDates) {

                    let notification = []
                    notification.movieid = movie.movieid
                    notification.start_date = movie.start_date
                    notification.end_date = movie.end_date
                    notification.title = movie.moviename
                    notification.cinema = movie.cinema

                    this.notifications.push(notification)

               }
               this.calculateDisplayNotifications()


          },

          async calculateDisplayNotifications() {
               let newDisplayNotifications = []
               var today = new Date();
               for (const notif of this.notifications) {
                    //Check if owner deleted the movie
                    await axios.get('http://172.18.1.8:7000/movieexists/' + notif.movieid)

                         .then((response) => {
                              notif.exists = response.data

                         }
                         ).catch((error) => {
                              console.error(error)
                         })

                    if (notif.exists == "True") {
                         var moviestartdate = new Date(notif.start_date)
                         var movieenddate = new Date(notif.end_date)


                         if ((moviestartdate <= today) && (movieenddate >= today)) {
                              notif.startnotification = true
                              newDisplayNotifications.push(notif)
                         }
                         else if (movieenddate < today) {
                              notif.startnotification = false
                              newDisplayNotifications.push(notif)
                         }
                    }

               }
               this.displayNotifications = newDisplayNotifications

          },



     },


     beforeMount() {
          this.token = document.getElementsByTagName('body')[0].getAttribute('token') || '{}'
          this.userid1 = document.getElementsByTagName('body')[0].getAttribute('userid') || '{}'
          this.initializeData()

     },
     mounted: function () {

          window.setInterval(() => {
               this.getMoviesDateChanges()
               this.rendering = false
          }, 5000)
     }
})
