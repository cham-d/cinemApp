<template>

      <div class="card" style="width: 100%;" >
        <!--<img src="..." class="card-img-top" alt="..."> -->
                 <div class="card-body">
                       <div v-if="startnotification">                       
                    <h5 class="card-title">Movie [[title]] is now playing on Cinema [[cinema]] !</h5>
                        <p class="card-text">Started at: [[start_date]] <br> Ends at: [[end_date]]
                        
                      </p>
                    </div>
                  <div v-if="!startnotification">                       
                    <h5 class="card-title">Movie [[title]] is not longer playing on Cinema [[cinema]] !</h5>
                        <p class="card-text">Ended at: [[end_date]]
                      </p>
                    </div>

                 </div>
      </div>
</template>


<style scoped>


.card-title{
        text-decoration: underline;
}
</style>

<script>
module.exports = {
        props:['start_date','end_date','title','cinema','startnotification'],
        delimiters: ['[[', ']]'],
        data(){
              return{

              }
        },
        beforeMount(){

             
        },
        mounted()
        {

        },
        methods: 
        {
  


}
}
</script>
