Vue.component('card',window.httpVueLoader('/static/scripts/components/cinema.vue'))

Vue.component('v-model-select',window.httpVueLoader('/static/scripts/components/costumSearch.vue'))


new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  data () 
  {
  return {
    cinemas: [],
    moviesCopy: [],
    owner:'',
    name:'',
    search:'',
    cinemasCopy:[],
    loading:true,
    addCinema:false,
    wantDelete:false,
    isEditing:false
}
   },
methods: {
     fetchApi()
    {     
        if (this.search)
        {
            
            this.cinemas=this.cinemas.filter(cinemas => 
             cinemas.NAME.toLowerCase().includes(this.search.toLowerCase()) 
                )

        }else{
            this.cinemas=this.cinemasCopy
        }
        
    },

    searchByName(){
        this.fetchApi()
    },

    async addCinemaFunction()
    {
        const body={
            "NAME":this.name,
            "OWNER":this.userid1,
        }
        axios.defaults.headers.common['X-Auth-Token'] = this.token // for all requests
        await axios.post('http://172.18.1.8:7000/cinema',body)
        .then((response)=>
        {
              if (response.data!='Failed to Add')
              {
                //   this.cinemas.push(response.data)
                  this.cinemasCopy.push(response.data)
              }
              this.name=''
              this.owner=''
              this.addCinema=false
        }
        ).catch((error) => 
        {

              console.error(error)
        })        

    },

    async initializeData()
    {
        const auth_token=this.token
        axios.defaults.headers.common['X-Auth-Token'] = auth_token // for all requests
        await axios.get('http://172.18.1.8:7000/cinema/'+this.userid1)
        .then((response)=>
        {
                this.cinemas=response.data
                this.cinemasCopy=response.data
        }
        ).catch((error) => 
        {
            console.error(error)
        }
        )
        this.loading=false

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