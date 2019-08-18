<template>
  <v-layout justify-center>
    <v-flex xl3 lg3 sm10>
      <v-form>
        <v-text-field v-model="email" label="이메일" required single-line solo></v-text-field>
        <v-text-field v-model="password" label="비밀번호" required single-line solo type="password"></v-text-field>
        <div class="text-center">
          <v-btn color="success" @click="onSubmit" :disabled="!email || !password">로그인</v-btn>
        </div>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    /*
    onSubmit(email, password) {
      this.$store
        .dispatch("LOGIN", { email, password })
        .then(() => {
          this.redirect();
        })
        .catch(({ msg }) => alert(msg));
    },
    redirect() {
      const { search } = window.location;
      const tokens = search.replace(/^\?/, "").split("&");
      const { returnPath } = tokens.reduce((qs, tkn) => {
        const pair = tkn.split("=");
        qs[pair[0]] = decodeURIComponent(pair[1]);
        return qs;
      }, {});

      this.$router.push(returnPath);
    }
    */
    onSubmit() {
      this.$http
        .post("/users/login", {
          email: this.email,
          password: this.password
        })
        .then(res => {
          this.email = "";
          this.password = "";

          if (!res.data.error) {
            localStorage.setItem("userToken", res.data);
            this.$router.push({ name: "user" });
          } else {
            alert(res.data.error);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
