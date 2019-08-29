<template>
  <v-layout justify-center>
    <v-flex xl3 lg3 sm6>
      <v-form>
        <v-text-field
          v-validate="'required|email'"
          :error-messages="errors.collect('email')"
          data-vv-name="email"
          v-model="form.email"
          label="이메일"
          required
          single-line
          solo
        ></v-text-field>
        <v-text-field
          v-validate="'required|min:6'"
          :error-messages="errors.collect('password')"
          data-vv-name="password"
          v-model="form.password"
          ref="password"
          label="비밀번호"
          required
          single-line
          solo
          type="password"
        ></v-text-field>
        <v-text-field
          v-validate="'required|confirmed:password'"
          :error-messages="errors.collect('passwordConfirm')"
          data-vv-name="passwordConfirm"
          v-model="form.passwordConfirm"
          label="비밀번호 확인"
          required
          single-line
          solo
          type="password"
        ></v-text-field>
        <v-text-field
          v-validate="'required'"
          :error-messages="errors.collect('last_name')"
          data-vv-name="last_name"
          v-model="form.last_name"
          label="성"
          required
          single-line
          solo
        ></v-text-field>
        <v-text-field
          v-validate="'required'"
          :error-messages="errors.collect('first_name')"
          data-vv-name="first_name"
          v-model="form.first_name"
          label="이름"
          required
          single-line
          solo
        ></v-text-field>
        <div class="text-center">
          <v-btn color="success" @click="onSubmit">회원가입</v-btn>
          <v-btn color="info" @click="onClear">초기화</v-btn>
        </div>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import ko from 'vee-validate/dist/locale/ko.js';

export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      form: {
        email: '',
        password: '',
        passwordConfirm: '',
        first_name: '',
        last_name: ''
      },
      dictionary: {
        messages: ko.messages,
        attributes: {
          email: '이메일 ',
          password: '비밀번호 ',
          passwordConfirm: '비밀번호 확인 ',
          first_name: '이름 ',
          last_name: '성 '
        }
      },
      custom: {
        /*
        name: {
          required: () => "Name can not be empty",
          max: "The name field may not be greater than 10 characters"
        }
        */
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
  },
  methods: {
    onSubmit () {
      this.$validator
        .validateAll()
        .then(result => {
          if (!result) throw new Error('모든 항목을 양식에 맞게 기입해주세요.')
          return this.$axios.post('/users/signup', this.form)
        })
        .then(result => {
          if (!result) throw new Error('서버에서 요청을 거부했습니다.')
          alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.')
          this.$router.push('/login')
        })
        .catch(err => {
          alert(err.message)
        })
    },
    onClear () {
      this.form.email = '';
      this.form.password = '';
      this.form.passwordConfirm = '';
      this.form.first_name = '';
      this.form.last_name = '';
      this.$validator.reset()
    }
  }
}
</script>
