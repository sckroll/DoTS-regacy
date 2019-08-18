<template>
  <v-app>
    <v-app-bar app color="blue darken-4" dark shrink-on-scroll>
      <v-toolbar-title class="headline">
        <span class="font-weight-medium">DoTS</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
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