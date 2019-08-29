<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ teamName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line v-for="(user, index) in users" :key="index">
          <v-list-item-avatar>
            <v-img :src="user.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.position }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-icon v-if="user.isUser" color="blue darken-4">mdi-star</v-icon>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item @click="$router.push({ name: 'user' })">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>홈으로</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>설정</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-help-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>도움말</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>정보</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- temporary -->
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
        <v-list-item></v-list-item>
      </v-list>

      <v-footer class="white body-2">
        <v-layout
          align-end
          fill-height
        >&copy; {{ new Date().getFullYear() }} DoTS. All rights reserved.</v-layout>
      </v-footer>
    </v-navigation-drawer>

    <v-app-bar app color="blue darken-4" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline">
        <span class="font-weight-medium">{{ projectName }}</span>
        <!-- <span class="font-weight-light"></span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="headline">
        <span class="font-weight-light">{{ teamName }}</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <br />
      <v-layout justify-center>
        <v-flex xl8 lg8 sm10>
          <print-node></print-node>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import PrintNode from './PrintNode';

export default {
  name: 'App',
  props: {
    source: String
  },
  components: {
    PrintNode
  },
  data: () => ({
    drawer: false,
    teamName: 'Team01',
    projectName: 'Project01',
    users: [
      {
        name: 'Haewoong Kwak',
        position: 'Leader',
        avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
        isUser: false
      },
      {
        name: 'Myunghwa Ji',
        position: 'Developer',
        avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        isUser: false
      },
      {
        name: 'Seongchan Kim',
        position: 'Developer',
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        isUser: true
      }
    ]
  })
}
</script>
