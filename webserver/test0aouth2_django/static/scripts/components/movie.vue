<template>

      <div class="card" style="width: 16rem;" v-if="!hide">
        <!--<img src="..." class="card-img-top" alt="..."> -->
                 <div class="card-body">

                    <h5 class="card-title">[[ title ]]</h5>
                    <p class="card-text"><b><mark><em>Start Date:</em></mark></b> [[start_date]] <br> <b><mark><em>End Date:</em></mark></b> [[end_date]] <br> <b>
                    <em>Cinema:</em></b> [[cinema]] <br> <b><em>Category:</em></b> <br><span>[[categor.join(',')]]</span> </p>
                    <div class="row">


                          
            <!-- <button type="submit"  class="btn btn-primary mr-1" :disabled="isDisabled">Add to Favorites</button>  -->
                        <button type="submit"  v-bind:class="{ 'btn-danger': isFavor, 'btn-primary mr-1 ': !isFavor }" class="btn btn-primary mr-1" @click="added" >
                              [[ isFavor? "Remove from Favorites" : "Add to Favorites" ]]</button> 
                              
                    <a href="#" class="btn btn-secondary">Subscribe</a>
                    </div>
                 </div>
      </div>
</template>

<style scoped>


.card-title{
        text-align:center;
}
</style>

<script>
module.exports = {
        props:['title','id','start_date','end_date','cinema','category','isfav','destroyafterremove'],
        delimiters: ['[[', ']]'],
        data(){
              return{
                    isFavor: false,
                    hide: false,
                    categor:[],
                    loading:false
                    
              }
        },
        beforeMount(){
              this.isFavor=this.isfav,
              this.categor=this.category
              this.categor= this.categor.replace(/'/g, '"')
              this.categor=JSON.parse(this.categor)
             
        },
        methods: 
        {
            added() {
            if (!this.isFavor)
            {      
                  sucess=this.$emit('addtofav',this.id);
                  if (sucess)
                  {
                              this.isFavor = true;
                  }else{
                        console.log("error while adding to Favorites")
                  }
            }
            else
            {
                 
                  // if (!this.favid)
                  // {
                  //        // if movie doesnt have favourite id
                  //       sucess=this.$emit('reloadfavourites',this.id);
                  // }else
                  // {
                       let sucess=this.$emit('removefromfav',this.id);
                       if (this.destroyafterremove)
                       {
                             this.hide=true
                       }
                  
                  if (sucess)
                  {
                        this.isFavor=false
                  }else
                  {
                        console.log("error while removimg Favorites")
                  }
 
            }

            

       },

}
}
</script>
