<template>
  <v-flex>
    <v-text-field
      @keyup.enter="submit"
      v-model="urlTextField"
      label="URL을 입력하세요"
      single-line
      solo
      clearable
    ></v-text-field>
    <v-btn color="blue darken-4 white--text" @click="onSubmit">크롤링 시작</v-btn>
    <v-btn color="warning" @click="truncate">초기화</v-btn>
    <br />
    <br />
    <div v-if="isValueRequested">
      <span class="headline font-weight-light">다음의 URL로 접속합니다.</span>
      <br />
      <span class="headline font-weight-medium">{{ decodeURI(currURL) }}</span>

      <br />
      <br />
      <div v-if="isDataLoaded">
        <div>
          <span class="headline font-weight-light">URL 노드 레벨:&nbsp;</span>
          <span class="headline font-weight-medium">{{ crawledData.level }}</span>
        </div>
        <div>
          <span class="headline font-weight-light">Paths:&nbsp;</span>
          <span class="headline font-weight-medium">{{ crawledData.paths }}</span>
        </div>
      </div>
      <div v-else>
        <span class="headline font-weight-light">올바른 URL 형식이 아닙니다.</span>
        <br />
        <span class="headline font-weight-medium">{ 프로토콜 }://{ 호스트 주소 }/{ 경로 }&nbsp;</span>
        <span class="headline font-weight-light">순으로 입력해주세요.</span>
      </div>
    </div>
    <div v-else>
      <span class="headline font-weight-medium">테스트용 페이지입니다.</span>
      <br />
      <span class="headline font-weight-light">URL을 입력하면 임시 크롤링 정보와 시각화 정보가 출력됩니다.</span>
    </div>
    <br />
    <v-layout justify-center>
      <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
    </v-layout>
  </v-flex>
</template>

<script>
import D3Network from 'vue-d3-network';
import jwtDecode from 'jwt-decode';

// 사용할 검색 엔진
const SEARCH_ENG = 'google';

export default {
  components: {
    D3Network
  },
  data () {
    return {
      prevURL: '',
      currURL: '',
      urlTextField: '',
      isValueRequested: false,
      isDataLoaded: false,
      totalData: [],
      crawledData: {},
      mainTopic: 'Main Topic',
      nodes: [],
      links: [],
      nodeSize: 30,
      fontSize: 20,
      canvas: false,
      nodeIndex: 0
    }
  },
  computed: {
    options () {
      return {
        force: 4000,
        size: { w: 1000, h: 800 },
        nodeSize: this.nodeSize,
        fontSize: this.fontSize,
        nodeLabels: true,
        linkLabels: true,
        canvas: this.canvas
      }
    }
  },
  created () {
    // 레벨 0 노드 초기화
    this.addZeroNode()

    this.$http
      .get('/data')
      .then(result => {
        this.totalData = result.data
        if (this.totalData.length > 0) {
          // 이후의 노드 초기화
          this.initializeNodes()
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    // 크롤링 시작
    submit (val) {
      var value = '';

      if (val.target) {
        value = val.target.value
      } else {
        value = val
      }

      if (value !== '') {
        this.currURL = value
        this.isValueRequested = true

        const decoded = jwtDecode(localStorage.getItem('userToken'))

        // axios를 이용, 서버에 값 요청
        this.$http
          .post('/data/add', {
            userEmail: decoded.email,
            userName: decoded.first_name + ' ' + decoded.last_name,
            prevURL: this.prevURL,
            currURL: this.currURL
          })
          .then(response => {
            if (response.data.notUrl) {
              this.isDataLoaded = false
            } else {
              this.crawledData = response.data
              this.isDataLoaded = true

              // 불러온 데이터로부터 노드 생성 및 추가
              this.addNodesfromCrawledData()

              this.prevURL = this.currURL
            }
          })
      } else {
        this.currURL = '';
        this.isValueRequested = false
      }
    },
    onSubmit () {
      this.submit(this.urlTextField)
    },
    // 모든 노드 삭제
    truncate () {
      this.$http
        .get('/data/delete')
        .then(result => {
          this.nodes = []
          this.links = []
          this.nodeIndex = 0
          this.isValueRequested = false
          this.isDataLoaded = false
          this.urlTextField = '';

          this.addZeroNode()

          alert('모든 노드를 삭제했습니다.')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 노드 초기화
    initializeNodes () {
      var nodeLevel1 = '';

      // 각 URL에 대해 진행
      this.totalData.forEach((item, index) => {
        // URL이 레벨 1인지 검사
        if (item.paths[0].indexOf('www.' + SEARCH_ENG) !== -1) {
          if (item.paths.length > 1) {
            nodeLevel1 = item.paths[1]
          } else {
            nodeLevel1 = SEARCH_ENG
          }

          this.addInitialNodesAndLinks(nodeLevel1)
        } else {
          nodeLevel1 = 'etc.';

          this.addInitialNodesAndLinks(nodeLevel1)

          // 레벨 2 이상일 경우 노드 및 간선 추가
          this.addNodesAndLinks(item)
        }
      })
    },
    // 크롤링한 데이터를 노드로 추가
    addNodesfromCrawledData () {
      var nodeLevel1 = '';

      // URL이 레벨 1인지 검사
      if (this.crawledData.paths[0].indexOf('www.' + SEARCH_ENG) !== -1) {
        if (this.crawledData.paths.length > 1) {
          nodeLevel1 = this.crawledData.paths[1]
        } else {
          nodeLevel1 = SEARCH_ENG
        }

        this.addInitialNodesAndLinks(nodeLevel1)
      } else {
        nodeLevel1 = 'etc.';

        this.addInitialNodesAndLinks(nodeLevel1)

        // 레벨 2 이상일 경우 노드 및 간선 추가
        this.addNodesAndLinks(this.crawledData)
      }
    },
    // 레벨 0 노드 추가
    addZeroNode () {
      this.nodes.push({
        id: this.nodeIndex++,
        name: this.mainTopic,
        _color: 'blue',
        level: 0
      })
    },
    // 레벨 1 노드 및 간선 추가
    addInitialNodesAndLinks (label) {
      var isPushed = false

      // 이미 존재하는 노드인지 검사
      this.nodes.forEach((item, index) => {
        if (item.level === 1) {
          if (item.name === `[1] ${label}`) {
            isPushed = true
          }
        }
      })

      if (!isPushed) {
        this.nodes.push({
          id: this.nodeIndex++,
          name: `[1] ${label}`,
          _color: 'cyan',
          level: 1
        })
        this.links.push({
          sid: 0,
          tid: this.nodeIndex - 1,
          _svgAttrs: { 'stroke-width': 8, opacity: 1 }
        })
      }
    },
    // 레벨 2 이후의 노드 및 간선 추가
    addNodesAndLinks (data) {
      var prevNodeId = 0
      var currNodeId = 0
      data.paths.forEach((item, index) => {
        // 각 노드들과 비교하여 중복되는 이름의 노드가 존재하는지 검사
        this.nodes.forEach((node, idx) => {
          if (node.name.split(' ')[1] === item) {
            currNodeId = node.id
          }
        })

        // prev < curr : 중복되므로 노드를 생성하지 않고 패스
        // prev == curr : 노드 생성
        // prev > curr : 여기서부터는 중복되지 않으므로 다시 노드 생성 ()
        if (prevNodeId >= currNodeId) {
          this.nodes.push({
            id: this.nodeIndex++,
            name: `[${index + 2}] ${decodeURI(item)}`,
            level: index + 2
          })

          var sid =
            prevNodeId === currNodeId
              ? index === 0
                ? 1
                : this.nodeIndex - 2
              : prevNodeId
          var tid = this.nodeIndex - 1
          this.links.push({ sid, tid })
        }

        prevNodeId = currNodeId
        currNodeId = 0
      })
    }
  }
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css">
</style>
