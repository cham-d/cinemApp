<template>
  <div class="card" style="width: 16rem" v-if="!hide">
    <div class="card-body">
      <h5 class="card-title">[[ title ]]</h5>
      <p class="card-text">
        <b
          ><mark><em>Start Date:</em></mark></b
        >
        [[start_date]] <br />
        <b
          ><mark><em>End Date:</em></mark></b
        >
        [[end_date]] <br />
        <b> <em>Cinema:</em></b> [[cinema]] <br />
        <b><em>Category:</em></b> <br /><span>[[categor.join(',')]]</span>
      </p>
      <div class="row">
        <button
          type="submit"
          v-bind:class="{
            'btn-danger': isFavor,
            'btn-primary mr-1 ': !isFavor,
          }"
          class="btn btn-primary mr-1"
          @click="added"
        >
          [[ isFavor? "Remove from Favorites" : "Add to Favorites" ]]
        </button>
        <button
          type="submit"
          v-bind:class="{ 'btn-danger': isSub, 'btn btn-secondary ': !isSub }"
          class="btn btn btn-secondary"
          @click="sub"
        >
          [[ isSub? "Unsubscribe" : "Subscribe" ]]
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  text-align: center;
}
</style>

<script>
module.exports = {
  props: [
    "title",
    "id",
    "start_date",
    "end_date",
    "cinema",
    "category",
    "isfav",
    "issub",
    "destroyafterremove",
  ],
  delimiters: ["[[", "]]"],
  data() {
    return {
      isFavor: false,
      isSub: true,
      hide: false,
      categor: [],
      loading: false,
    };
  },
  beforeMount() {
    (this.isFavor = this.isfav),
      (this.isSub = this.issub),
      (this.categor = this.category);
    this.categor = this.categor.replace(/'/g, '"');
    this.categor = JSON.parse(this.categor);
  },
  methods: {
    added() {
      if (!this.isFavor) {
        sucess = this.$emit("addtofav", this.id);
        if (sucess) {
          this.isFavor = true;
        } else {
          console.log("error while adding to Favorites");
        }
      } else {
        let sucess = this.$emit("removefromfav", this.id);
        if (this.destroyafterremove) {
          this.hide = true;
        }

        if (sucess) {
          this.isFavor = false;
        } else {
          console.log("error while removimg Favorites");
        }
      }
    },

    sub() {
      if (!this.isSub) {
        let data = {
          movieid: this.id,
          moviename: this.title,
          startdate: this.start_date,
          enddate: this.end_date,
          cinema: this.cinema,
        };
        sucess = this.$emit("addtosub", data);
        if (sucess) {
          this.isSub = true;
        } else {
          console.log("error while adding to Subs");
        }
      } else {
        let sucess = this.$emit("removefromsub", this.id);

        if (sucess) {
          this.isSub = false;
        } else {
          console.log("error while removimg sub");
        }
      }
    },
  },
};
</script>
