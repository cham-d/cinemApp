Vue.component('card',window.httpVueLoader('/static/scripts/components/movie.vue'))
Vue.component('v-model-select',window.httpVueLoader('/static/scripts/components/costumSearch.vue'))
// Vue.component('v-model-select',window.httpVueLoader('/static/scripts/components/searchText.vue'))



new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  data () 
  {
  return {
    movies: [],
    token : null,
    userid1:'',
    favorites: [],
    search: '',
    searchCategory:'',
    searchCinema:'',
    searchStartDate:'',
    searchEndDate:'',
    favID:'',
    show_costum_search: false,
    loading: true,
         }
   },
methods: {
    async fetchApi()
    {
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
        const auth_token=this.token
        // console.log(auth_token)

        axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
        await axios.get('http://172.18.1.8:7000/movie')
        .then((response)=>
        {


            if (this.search || this.searchCategory || this.searchCinema || this.searchStartDate || this.searchEndDate)
            {
 
                this.movies=response.data,
                this.movies=this.movies.filter(movies => 
                    movies.CATEGORY.toLowerCase().includes(this.searchCategory.toLowerCase()) 
                    && movies.TITLE.toLowerCase().includes(this.search.toLowerCase()) 
                    && movies.CINEMANAME.toLowerCase().includes(this.searchCinema.toLowerCase())
                    && movies.CINEMANAME.toLowerCase().includes(this.searchCinema.toLowerCase())
                    )
                this.movies=this.movies.filter(byStartDate)
                this.movies=this.movies.filter(byEndDate)

            }else
            {    
                this.movies=response.data
                console.log(response.data)
            }
            
            this.loadUSersFavourites()

        }
        ).catch((error) => 
        {
            console.error(error)
        })
        this.loading=false
    },

     searchByName(){
        this.fetchApi()
    },

     searchByCinemaName(passedData){
        this.searchCinema=passedData
        this.fetchApi()
    },

     searchByStartDate(passedData){
        this.searchStartDate=passedData
        this.fetchApi()
    },

     searchByEndDate(passedData){
        this.searchEndDate=passedData
        this.fetchApi()
    },

    async initializeData()
    {
        const auth_token=this.token

        axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
        await axios.get('http://localhost/favorite')
        .then((response)=>
        {
                this.favorites=response.data.filter(favorites => 
                favorites.USERID.toLowerCase().includes(this.userid1.toLowerCase()))
        }
        ).catch((error) => 
        {
            console.error(error)
        })
        this.fetchApi()
    },
     testMethod(passeDATA)
    {
        this.searchCategory=passeDATA,
        this.fetchApi()
    },
    cinemaSearch(passedData)
    {
        this.searchCinema=passedData,
        this.fetchApi()

    },

    async addToFav(passedData){
        const auth_token=this.token
        axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests

        const body={ 
            "USERID": this.userid1,
            "MOVIEID": passedData
        }
        await axios.post('http://localhost/favorite',body)
         .then((response)=>
        {
            console.log(response.data)


            // save favourite ID
        for (var k=0;k<this.movies.length;k++)
         {
                if (passedData==this.movies[k]._id)
                {
                    this.movies[k].favID=response.data
                    this.movies[k].isFav=true
                    break;
                    
                }
           } 
        }
        )
            .catch((error) => 
            {
                console.error(error)
                return false
            })
            return 'ok';
    
    },
    

    async removeFromFav(passedData1){
        //Find Favid
        let favIDtoDelete=''
        for (var i in this.movies) {
            if (this.movies[i]._id == passedData1) {
               favIDtoDelete=this.movies[i].favID
               break; //Stop this loop, we found it!
            }
          }
        const auth_token=this.token
        axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
        await axios.delete('http://localhost/favorite/'+favIDtoDelete)
        .then((response)=>
        {
               console.log(response.data)
               return true
        }
        ).catch((error) => 
        {
            console.error(error.response.data)
            return false
        })
    
    },

    loadUSersFavourites()
    {
        for (var j=0;j<this.movies.length;j++)
        {
            for (var k=0;k<this.favorites.length;k++)
         {
               let fav_mov_ID=this.favorites[k].MOVIEID;
                if (fav_mov_ID==this.movies[j]._id)
                {
                    this.movies[j].isFav=true
                    this.movies[j].favID=this.favorites[k]._id
                    break;
                }else
                {
                    this.movies[j].isFav=false
                }

           }
         }
    }


},
beforeMount(){
     this.token = document.getElementsByTagName('body')[0].getAttribute('token') || '{}'
     this.userid1 = document.getElementsByTagName('body')[0].getAttribute('userid') || '{}'
     
},
mounted()
{
    this.initializeData()
    

}
})