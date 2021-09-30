<template>

<div id="v-model-select" class="demo">
    <span>Category: </span>

  <select v-on:change="parentCall" v-model="selected">
    <option  value="">Any</option>
  <option  v-for="(attribute) in attributes" v-bind:key="attribute " >[[ attribute ]]</option> 
  </select>
  <!-- <span>Selected:  [[selected]] </span> -->
  <input type="text" placeholder="Search Cinema Names" v-model.trim="searchCinemaNames" @keyup="cinemaNameSearch">
  <label for="start_date" >Starts After:</label>
  <input type="date" id="start_date" name="start_date"  v-model="searchStartDate" v-on:change="startDateSearch">
  <label for="end_date">Ends Before:</label>
  <input type="date" id="end_date" name="end_date"  v-model="searchEndDate" v-on:change="endDateSearch">

</div>

</template>
<style scoped>
.demo {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
  text-align:center;
}

input[type=text] {
  border: 2px solid rgb(0, 0, 0);
  border-radius: 4px;
  margin-left: 6px;
}
</style>

<script>
module.exports = {
        props:  {
            attributes: {
                type: Array,
                required: false
                }
            },
        delimiters: ['[[', ']]'],
                data(){
                    return{
                            selected: '',
                            searchCinemaNames:'',
                            searchStartDate:'',
                            searchEndDate:''
                    }
                },
        methods: {
            parentCall() 
            {

                this.$emit('ecentname',this.selected);

            },
            cinemaNameSearch(){
                this.$emit('searchcinemanamesevent',this.searchCinemaNames);
            },
            startDateSearch(){
                this.$emit('searchstartdateevent',this.searchStartDate);
            },
            endDateSearch(){
                this.$emit('searchenddateevent',this.searchEndDate);
            }

        }

}
</script>
