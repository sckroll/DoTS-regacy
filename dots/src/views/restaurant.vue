<template>
    <v-container grid-list-xl>
        <v-layout row wrap>
            <v-flex 
                xs12
                sm4
                v-for="(restaurant, index) in restaurants"
                :key="index">
                <v-card>
                    <v-img
                        aspect-ratio="2"
                        src="https://cdn.vuetifyjs.com/images/cards/cooking.png">
                            <v-container fill-height fluid>
                                <v-layout fill-height>
                                    <v-flex xs12 align-end flexbox>
                                        <span class="headline white--text">{{ restaurant.name }}</span>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                    </v-img>
                    <v-card-text>
                        <div>{{ restaurant.type }}</div>
                        <div>주소: {{ restaurant.address }}</div>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-icon small class="px-2">favorite</v-icon><span>0</span>
                        <v-icon small class="px-2">comment</v-icon><span>0</span>
                        <v-icon small class="px-2">visibility</v-icon><span>0</span>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            restaurants: [
                {
                    name: '장모님 식당',
                    type: '한식',
                    address: '경기도 안양시 동안구 평촌동 123-1'
                },
                {
                    name: '아저씨 초밥',
                    type: '일식',
                    address: '경기도 안양시 동안구 평촌동 143-1'
                },
                {
                    name: '매운 짬뽕집',
                    type: '중식',
                    address: '경기도 안양시 동안구 평촌동 369-1'
                },
                {
                    name: '월남선생',
                    type: '베트남 음식',
                    address: '경기도 안양시 동안구 평촌동 234-1'
                }
            ]
        }
    }
}
</script>
