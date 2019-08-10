<template>
  <v-content>
    <!-- <div v-for="product in products">
      <img :src="product.product_imagelink" />
      <div>
        {{ product.product_name }}
        <router-link :to="{ name: 'show', params: { _id: product._id }}">더보기</router-link>
      </div>
    </div>-->
    <div>
      <!-- <span class="headline font-weight-light">URL 레벨:&nbsp;</span>
      <span class="headline font-weight-medium">{{ crawledData }}</span>-->
    </div>
  </v-content>
</template>

<script>
export default {
  props: ["urlValue"],
  data() {
    return {
      crawledData: []
    };
  },
  created() {
    if (this.urlValue) {
      this.$router.push({ name: "show", params: { url: this.urlValue } });
    }
  }
  /*
  created() {
    this.$http
      .get("/data", { url: this.urlValue })
      .then(response => {
        this.crawledData = response.data;
      })
      .catch(err => {
        throw err;
      });
  }
  */
};
</script>
