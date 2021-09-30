Vue.component('card',window.httpVueLoader('/static/scripts/components/movieOwner.vue'))

Vue.component('v-model-select',window.httpVueLoader('/static/scripts/components/costumSearch.vue'))


new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  data () 
  {
  return {
    movies: [],
    moviesCopy: [],
    token : null,
    userid1:'',
    search: '',
    searchCategory:'',
    searchCinema:'',
    searchStartDate:'',
    searchEndDate:'',
    cinemas:'',
    show_costum_search: false,
    loading: true,
    addMovie: false,
    title:'',
    startdate:'',
    enddate: '',
    cinemaname:'Select a Cinema:',
    category:''
         }
   },
methods: {
     fetchApi()
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

        this.movies=this.moviesCopy
        if (this.search || this.searchCategory || this.searchCinema || this.searchStartDate || this.searchEndDate)
        {

            
            this.movies=this.movies.filter(movies => 
                movies.CATEGORY.toLowerCase().includes(this.searchCategory.toLowerCase()) 
                && movies.TITLE.toLowerCase().includes(this.search.toLowerCase()) 
                && movies.CINEMANAME.toLowerCase().includes(this.searchCinema.toLowerCase())
                && movies.CINEMANAME.toLowerCase().includes(this.searchCinema.toLowerCase())
                )
            this.movies=this.movies.filter(byStartDate)
            this.movies=this.movies.filter(byEndDate)

        }  
        
    },


    async getData()
    {
        const auth_token=this.token
        axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
        // for (var k in this.cinemas)
        this.movies=[]
        this.moviesCopy=[]
        for (var k in this.cinemas)
        {
        await axios.get('http://localhost/movie?searchCinema='+this.cinemas[k].NAME)
        .then((response)=>
        {

            for (var l in response.data)
            {
                this.movies.push(response.data[l])
            }
            
        }
        ).catch((error) => 
        {
            console.error(error)
        })
    }
    this.moviesCopy=this.movies
    this.loading=false
    },
     searchByName(){
        this.fetchApi()
    },

    async addMovieFunction()
    {
        // this.addMovie=true

        let parsCat=""
        if (typeof this.category == 'string')
        {
        const splitCat = this.category.split(",");
        var jsonCat = JSON.stringify(splitCat);
         parsCat=JSON.parse(jsonCat)
        // this.loading=true
        this.categoryEdit=parsCat
        }else
        {
              var jsonCat1 = JSON.stringify(this.category);
              parsCat=JSON.parse(jsonCat1)
        }
        console.log(this.parsCat)
        console.log(typeof this.parsCat)
        const body={
            "TITLE":this.title,
            "STARTDATE":this.startdate,
            "ENDDATE":this.enddate,
            "CINEMANAME": this.cinemaname,
            "CATEGORY":parsCat
        }
        axios.defaults.headers.common['X-Auth-Token'] = this.token // for all requests
        await axios.post('http://localhost/movie',body)
        .then((response)=>
        {
              console.log(response.data)
              if (response.data!='Failed to Add')
              {
                  this.movies.push(response.data)
              }
              this.addMovie=false
              this.title=''
              this.startdate=''
              this.enddate=''
              this.cinemaname=''
              this.category=''
        }
        ).catch((error) => 
        {

              console.error(error)
        })        

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
        await axios.get('http://localhost/cinema/'+this.userid1)
        .then((response)=>
        {
                this.cinemas=response.data
        }
        ).catch((error) => 
        {
            console.error(error)
        })
        this.getData()
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