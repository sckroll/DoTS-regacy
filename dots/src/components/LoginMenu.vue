<template>
  <v-app>
    <v-app-bar app color="transparent" flat height="200">
      <v-toolbar-title class="display-2 header-menu-title">
        <span
          class="font-weight-medium"
          @click="$router.push({ name: 'index' })"
          style="cursor: pointer;"
        >DoTS</span>
        <span class="font-weight-light">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span class="font-weight-light curr-site">로그인</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="header-menu-items">
        <v-btn
          class="headline font-weight-bold blue darken-4"
          dark
          @click="$router.push({ name: 'signup' })"
        >회원가입</v-btn>
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

<style scoped>
.content {
  margin-left: 0px;
}
</style>
