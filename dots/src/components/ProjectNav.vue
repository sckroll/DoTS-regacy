<template>
  <v-app>
    <nav-drawer :drawer="drawer" :project="project"></nav-drawer>

    <v-app-bar app color="blue darken-4" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline">
        <span class="font-weight-medium">{{ project.project_name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="headline">
        <span class="font-weight-light">{{ project.team_name }}</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-layout justify-center>
        <v-flex xl8 lg8 sm10>
          <print-node v-if="isLoaded" :project="project"></print-node>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import PrintNode from './PrintNode';
import NavDrawer from './NavDrawer';

export default {
  name: 'App',
  components: {
    PrintNode,
    NavDrawer
  },
  data: () => ({
    drawer: false,
    isLoaded: false,
    project: {}
  }),
  created () {
    this.$http
      .get('/projects/current', {
        params: {
          id: this.$route.params.id
        }
      })
      .then(result => {
        this.project = result.data
        this.isLoaded = true
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
