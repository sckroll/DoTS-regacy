<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ teamName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          two-line
          v-for="(user, index) in users" :key="index"
        >
            <v-list-item-avatar>
              <v-img :src="user.avatar"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.position }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-icon v-if="user.isUser">mdi-star</v-icon>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="blue darken-4"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline">
        <span class="font-weight-medium">DoTS</span>
        <span class="font-weight-light"> {{ projectName }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="headline">
        <span>{{ teamName }}</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    teamName: 'team01',
    projectName: 'Untitled',
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
