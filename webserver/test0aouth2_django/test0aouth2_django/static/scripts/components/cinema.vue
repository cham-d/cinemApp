<template>

      <div class="card" style="width: 16rem;" v-if="!hide">
        <!--<img src="..." class="card-img-top" alt="..."> -->
                            


      <div class="spinner-border" v-if="loading" role="status">
                  <span class="sr-only"></span>
      </div>
      <div class="wantDelete" v-if="!wantDelete">
                 <div class="card-body" v-if="!loading">

                    <h5 v-show="!isEditing" class="card-title">[[ nameEdit ]]</h5>
                   <span v-show="isEditing" >
                             <input v-model="nameEdit" type="text" class="form-control" >
                  </span>
                  
                    <p class="card-text">

                    <div class="row">                          
                        <button type="button" class="btn btn-primary" v-show="!isEditing" @click="edit">Edit</button>
                        <button type="button" class="btn btn-danger" v-show="!isEditing" @click="wantDelete=!wantDelete">Remove</button>
                  </div>
                  <button type="button" class="btn btn-primary" v-show="isEditing" @click="edit">Save</button>
                  <button type="button" class="btn btn-danger" v-show="isEditing" @click="cancel">Cancel</button>

                 </div>
    </div>
                 <div class="deleteButtons" v-if="wantDelete">
                  <h1>Are you sure?</h1>
                  <button type="button" class="btn btn-danger" @click="remove">Delete</button>
                   <button type="button" class="btn btn-primary" @click="wantDelete=!wantDelete">Cancel</button>
                 </div>
      </div>
</template>

<style scoped>


.card-title{
        text-align:center;
}

.spinner-border{
      margin-left: 50%;
      margin-top: 50%;

}
</style>

<script>
module.exports = {
        props:['name','id','auth_token','userid'],
        delimiters: ['[[', ']]'],
        data(){
              return{
                    isFavor: false,
                    hide: false,
                    categor:[],
                    isEditing: false,
                    editMovie: [],
                    nameEdit: '',
                    cinemaEdit:'',
                    loading:false,
                    wantDelete:false
                    
              }
        },
        beforeMount(){
            this.initializeData()
             
        },
        methods: 
        {
               edit()
              {
                    this.isEditing=!this.isEditing
                    if (!this.isEditing)
                    {
                        this.putData()
                    }


              },
              cancel()
              {
                    
                  this.isEditing=false
                  this.initializeData()

              },
             async remove()
              {
                    this.wantDelete=true
                  axios.defaults.headers.common['X-Auth-Token'] = this.auth_token // for all requests
                  await axios.delete('http://localhost/cinema/'+this.id)
                  .then((response)=>
                  {
                        console.log("delete ok")
                        this.hide=true
                  }
                  ).catch((error) => 
                  {
                        console.error(error)
                  })
              },

              async putData()
              {
                        const body={ 
                        "NAME": this.nameEdit,
                        "OWNER": this.userid,
                  }
                  console.log(body)
                  axios.defaults.headers.common['X-Auth-Token'] = this.auth_token // for all requests
                  console.log(this.id)
                  await axios.put('http://localhost/cinema/'+this.id,body)
                  .then((response)=>
                  {
                        console.log(response.data)
                  }
                  ).catch((error) => 
                  {
                        console.error(error)
                  })
                  this.loading=false
              },
              initializeData()
              {
                  this.nameEdit=this.name

              },
            viewPrettyCategor()
            {

            }

},

}
</script>
