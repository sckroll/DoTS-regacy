<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ project.team_name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line v-for="member in project.members" :key="member.email">
        <v-list-item-avatar>
          <v-avatar :color="member.color">
            <span class="white--text">{{ member.last_name.charAt(0) }}</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ member.first_name }} {{ member.last_name }}</v-list-item-title>
          <v-list-item-subtitle>{{ member.position }}</v-list-item-subtitle>
        </v-list-item-content>

        <!-- <v-icon v-if="member.isUser" color="blue darken-4">mdi-star</v-icon> -->
      </v-list-item>

      <v-list-item @click="inviteDialog = true">
        <v-list-item-icon>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>팀원 초대</v-list-item-title>
        </v-list-item-content>
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
    </v-list>

    <v-footer
      class="mb-2 transparent body-2"
      fixed
    >&copy; {{ new Date().getFullYear() }} DoTS. All rights reserved.</v-footer>

    <v-dialog v-model="inviteDialog" persistent max-width="600">
      <v-card tile>
        <v-card-title class="headline">팀원 추가</v-card-title>
        <v-card-text>
          새로운 팀원을 추가합니다. 추가하고자 하는 팀원의 이메일을 입력해주세요.
          <br />단, DoTS에 가입된 회원만 초대할 수 있습니다.
        </v-card-text>

        <v-text-field v-model="memberEmail" single-line solo-inverted class="mx-4"></v-text-field>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn color="green darken-1" text tile @click="inviteDialog = false">취소</v-btn>
          <v-btn color="red darken-1" text tile>확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'nav-drawer',
  props: {
    project: {
      type: Object
    },
    drawer: {
      type: Boolean
    }
  },
  data () {
    return {
      inviteDialog: false,
      memberEmail: ''
    }
  }
}
</script>
