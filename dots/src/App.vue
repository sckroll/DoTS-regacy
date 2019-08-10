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
          <v-text-field @keyup.enter="submit" label="URL을 입력하세요" single-line solo clearable></v-text-field>
          <div v-if="isValueRequested">
            <span class="headline font-weight-light">다음의 URL로 접속합니다.</span>
            <br />
            <span class="headline font-weight-medium">{{ decodeURI(urlValue) }}</span>

            <!-- <router-view :urlValue="urlValue"></router-view> -->
            <show-page :urlValue="urlValue"></show-page>
          </div>
          <div v-else>
            <span class="headline font-weight-medium">테스트용 페이지입니다.</span>
            <br />
            <span class="headline font-weight-light">URL을 입력하면 임시 크롤링 정보와 시각화 정보가 출력됩니다.</span>
          </div>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    teamName: "Team01",
    projectName: "Project01",
    users: [
      {
        name: "Haewoong Kwak",
        position: "Leader",
        avatar: "https://randomuser.me/api/portraits/men/81.jpg",
        isUser: false
      },
      {
        name: "Myunghwa Ji",
        position: "Developer",
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
        isUser: false
      },
      {
        name: "Seongchan Kim",
        position: "Developer",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        isUser: true
      }
    ],
    urlValue: "",
    isValueRequested: false
  }),
  methods: {
    submit(val) {
      if (val) {
        this.urlValue = val.target.value;
        this.isValueRequested = true;
      } else {
        this.urlValue = "";
        this.isValueRequested = false;
      }
    }
  }
};
</script>