<template>
    <div>
        <v-btn @click="post()">POST</v-btn>
        <v-btn @click="put()">PUT</v-btn>
        <v-btn @click="del()">DELETE</v-btn>
        <p>{{ response }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            response: ''
        }
    },
    methods: {
        post () {
            this.$http.post('/data/restaurant')
                .then(res => {
                    this.response = res.data
                })
                .catch(err => {
                    console.error(err)
                })
        },
        put () {
            this.$http.put('/data/restaurant/123')
                .then(res => {
                    this.response = res.data
                })
                .catch(err => {
                    console.error(err)
                })
        },
        del () {
            this.$http.delete('/data/restaurant/123')
                .then(res => {
                    this.response = res.data
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
}
</script>
