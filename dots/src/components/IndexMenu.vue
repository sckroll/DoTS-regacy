<template>
  <v-app>
    <v-app-bar app color="blue darken-4 aa" dark height="200">
      <v-toolbar-title class="display-2 header-menu-title">
        <span
          class="font-weight-medium"
          @click="$router.push({ name: 'index' })"
          style="cursor: pointer;"
        >DoTS</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="header-menu-items">
        <v-btn text class="headline" @click="$router.push({ name: 'about' })">About</v-btn>
        <v-btn text class="headline" @click="$router.push({ name: 'features' })">Features</v-btn>
        <v-btn text class="headline" @click="$router.push({ name: 'pricing' })">Pricing</v-btn>
        <v-btn text class="headline" @click="$router.push({ name: 'help' })">Help</v-btn>
        <v-btn
          class="headline font-weight-bold blue--text text--darken-4"
          color="white"
          dark
          @click="$router.push({ name: 'login' })"
        >로그인</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <div class="content">
        <router-view></router-view>
      </div>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.header-menu-title {
  margin-left: 150px;
  padding-top: 100px;
  padding-bottom: 50px;
}

.header-menu-items {
  margin-right: 150px;
  padding-top: 100px;
  padding-bottom: 50px;
}

.content {
  margin-top: 200px;
  margin-left: 150px;
}

.curr-site {
  font-size: 40px;
}
</style>
