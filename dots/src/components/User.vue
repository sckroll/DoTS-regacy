<template>
  <v-app>
    <v-container grid-list-xl grid-list-lg class="content-index">
      <div>
        <span class="display-1 font-weight-bold">{{user.first_name}}</span>
        <span class="display-1 font-weight-light">님의 프로젝트</span>
      </div>
      <br />
      <div>
        <v-layout wrap>
          <v-card width="400" min-height="300" class="cards">
            <v-img
              class="white--text"
              height="200px"
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
              <v-card-title class="align-end fill-height">{{ temp.projectName }}</v-card-title>
            </v-img>

            <v-card-text>
              <span class="subtitle-1">{{ temp.teamName }}</span>
              <br />
              <span class="text--primary">
                <span>{{ temp.description }}</span>
              </span>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="orange" @click="$router.push({ name: 'project' })">프로젝트 시작</v-btn>
              <v-btn text color="red">삭제</v-btn>
            </v-card-actions>
          </v-card>

          <v-card width="400" min-height="300" class="cards d-flex text-center align-center">
            <v-card-text>
              <v-icon color="blue darken-4" x-large>mdi-plus</v-icon>
              <br />
              <br />
              <span class="headline">새 프로젝트 생성</span>
            </v-card-text>
          </v-card>
        </v-layout>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      temp: {
        teamName: "Team01",
        projectName: "Project01",
        description: "테스트를 위한 임시 프로젝트입니다."
      }
    };
  }
};
</script>

<style scoped>
.cards {
  margin: 10px;
}
</style>
