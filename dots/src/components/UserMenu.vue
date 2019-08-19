<template>
  <v-app>
    <v-app-bar app color="blue darken-4" dark>
      <v-toolbar-title class="headline">
        <span class="font-weight-medium">DoTS</span>
        <!-- <span class="font-weight-light"></span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-title class="headline">
        <span class="font-weight-light">{{ user.first_name }}님 환영합니다!</span>
      </v-toolbar-title>-->
      <v-toolbar-items>
        <v-btn color="blue accent-1" text @click="signout">로그아웃</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <br />
      <v-layout justify-center>
        <v-flex xl10 lg10 sm10>
          <router-view :user="user"></router-view>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data () {
    return {
      user: {
        first_name: '',
        last_name: '',
        email: ''
      }
    }
  },
  created () {
    const token = localStorage.getItem('userToken')
    if (!token) this.signout()

    const decoded = jwtDecode(token)

    this.user.first_name = decoded.first_name
    this.user.last_name = decoded.last_name
    this.user.email = decoded.email
  },
  methods: {
    signout () {
      this.$store.commit('deleteToken')
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
