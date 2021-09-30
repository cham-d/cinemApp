<template>

      <div class="card" style="width: 16rem;" v-if="!hide">
        <!--<img src="..." class="card-img-top" alt="..."> -->
                            


      <div class="spinner-border" v-if="loading" role="status">
                  <span class="sr-only"></span>
      </div>
      <div class="wantDelete" v-if="!wantDelete">
                 <div class="card-body" v-if="!loading">

                    <h5 v-show="!isEditing" class="card-title">[[ titleEdit ]]</h5>
                   <span v-show="isEditing" >
                             <input v-model="titleEdit" type="text" class="form-control" >
                  </span>
                  
                    <p class="card-text">
                        <b><mark><em>Start Date:</em></mark></b> <span v-show="!isEditing">[[startDateEdit]] </span>
                        <span v-show="isEditing" >
                              <input v-model="startDateEdit" type="date" class="form-control" >
                        </span>
                        <b><mark><em>End Date:</em></mark></b> <span v-show="!isEditing">[[endDateEdit]] </span>
                        <span v-show="isEditing" >
                              <input v-model="endDateEdit" type="date" class="form-control" >
                        </span>                        
                        <b><em>Cinema:</em></b> <span v-show="!isEditing">[[cinemaEdit]]</span>
                        <span v-show="isEditing" >
                             <!-- <input v-model="cinemaEdit" type="text" class="form-control" > -->
                             <select class="form-select" aria-label="Default select example"  v-model="cinemaEdit">
                                <option  disabled>Select cinema:</option>
                                 <option v-for="cin in this.cinemas" :value="cin.NAME">[[cin.NAME]]</option>
                                 </select>
                        </span> 
                        <!-- <div v-show="!isEditing"></div>
                        <select class="form-select" aria-label="Default select example"  v-show="!isEditing" v-model="cinemaname">
                                <option disabled selected>Select cinema:</option>
                                <option v-for="cin in this.cinemas" :value="cin.NAME">[[cin.NAME]]</option>
                        </select> -->

                         <br v-show="!isEditing"> <b><em>Category:</em></b> <br><span v-show="!isEditing">[[categoryEdit.join(',')]]</span>
                        <span v-show="isEditing" >
                             <input v-model="categor" type="text" class="form-control" >
                        </span>

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
        props:['title','id','start_date','end_date','cinema','category','cinemas','auth_token'],
        delimiters: ['[[', ']]'],
        data(){
              return{
                    isFavor: false,
                    hide: false,
                    categor:[],
                    isEditing: false,
                    editMovie: [],
                    titleEdit: '',
                    startDateEdit:'',
                    endDateEdit:'',
                    categoryEdit:'',
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
                  await axios.delete('http://172.18.1.8:7000/movie/'+this.id)
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
                  console.log(this.category)
                  console.log(typeof this.categor)
                  let parsCat=""
                  if (typeof this.categor == 'string')
                  {
                  const splitCat = this.categor.split(",");
                  var jsonCat = JSON.stringify(splitCat);
                   parsCat=JSON.parse(jsonCat)
                  this.loading=true
                  this.categoryEdit=parsCat
                  }else
                  {
                        var jsonCat1 = JSON.stringify(this.categor);
                        parsCat=JSON.parse(jsonCat1)
                  }
                  console.log(parsCat)
                        const body={ 
                        "TITLE": this.titleEdit,
                        "STARTDATE": this.startDateEdit,
                        "ENDDATE": this.endDateEdit,
                        "CINEMANAME":this.cinemaEdit,
                        "CATEGORY": parsCat
                  }
                  axios.defaults.headers.common['X-Auth-Token'] = this.auth_token // for all requests
                  await axios.put('http://172.18.1.8:7000/movie/'+this.id,body)
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
                  console.log(this.category)
                  console.log(typeof this.category)
                  this.categor=this.category
                  this.categor= this.categor.replace(/'/g, '"')
                  this.categor=JSON.parse(this.categor)
                  this.categoryEdit=this.categor
                  this.titleEdit=this.title
                  this.startDateEdit=this.start_date
                  this.endDateEdit=this.end_date
                  this.cinemaEdit=this.cinema
              },
            viewPrettyCategor()
            {

            }

},

}
</script>
