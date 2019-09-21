<template></template>

<script>
import jwtDecode from 'jwt-decode'

export default {
  mounted() {
    this.$http.get('/projects/auth', {
      params: {
        project: this.$route.query.project,
        member: this.$route.query.member,
        token: this.$route.query.token,
        userEmail: jwtDecode(localStorage.getItem('userToken')).email
      }
    })
      .then((result) => {
        if (result.data.errorMessage) throw new Error(result.data.errorMessage)

        alert('프로젝트 팀원 등록이 완료되었습니다.')
      }).catch((err) => {
        alert(err)
      })
      .then(() => {
        this.$router.push({ name: 'user' })
      })
  }
}
</script>
