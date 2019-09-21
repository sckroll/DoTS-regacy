<template>
  <v-flex>
    <v-layout class="mt-4 text-center title font-weight-light">
      <v-spacer></v-spacer>
      <v-btn v-if="!isCrawlingStarted" color="success mr-4" tile dark @click="startCrawling">크롤링 시작</v-btn>
      <v-btn v-else color="warning mr-4" tile dark @click="stopCrawling">크롤링 중지</v-btn>
      <v-btn color="blue darken-4 mr-4" tile dark @click="truncate">초기화</v-btn>
    </v-layout>

    <v-layout justify-center class="d3-canvas">
      <d3-network
        :net-nodes="nodes"
        :net-links="links"
        :options="options"
        @node-click="nodeClick"
        @link-click="linkClick"
      />
    </v-layout>
    <div class="popup">
      <v-bottom-sheet v-model="sheet" inset>
        <v-sheet class="pa-6" tile color="blue darken-4">
          <div class="display-1 white--text">{{ pinnedNode.name.host }}</div>
          <div class="headline grey--text text--lighten-1">{{ pinnedNode.name.rest }}</div>
        </v-sheet>
        <v-sheet class="pa-6" tile color="blue darken-3">
          <div class="title-1 font-weight-light grey--text text--lighten-2">{{ pinnedNode.url }}</div>
        </v-sheet>
        <v-sheet class="pa-6" tile color="blue lighten-2">
          <v-row no-gutters>
            <v-col cols="3">
              <v-sheet tile color="blue lighten-2" class="headline">
                <span class="font-weight-light">노드 ID:</span>
                <span class="font-weight-medium ml-2">{{ pinnedNode.id }}</span>
              </v-sheet>
            </v-col>
            <v-col cols="3">
              <v-sheet tile color="blue lighten-2" class="headline">
                <span class="font-weight-light">노드 레벨:</span>
                <span class="font-weight-medium ml-2">{{ pinnedNode.level }}</span>
              </v-sheet>
            </v-col>
            <v-col cols="6">
              <v-sheet v-if="pinnedNode.tagged.length > 0" tile color="blue lighten-2" class="headline">
                <span class="font-weight-light">태그 표시한 팀원:</span>
                <span
                  v-for="member in project.members"
                  :key="member.email"
                  class="font-weight-medium ml-2"
                >
                  <span v-for="(user, index) in pinnedNode.tagged" :key="index" class="mx-2">
                    <v-avatar v-if="member.email === user" :color="member.color" size="32">
                      <span class="white--text subtitle-2">{{ member.last_name.charAt(0) }}</span>
                    </v-avatar>
                  </span>
                </span>
              </v-sheet>
              <v-sheet v-else tile color="blue lighten-2" class="headline">
                <span class="font-weight-light">태그 표시한 팀원:</span>
                <span class="font-weight-medium ml-2">없음</span>
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet>
        <v-sheet v-if="pinnedNode.id !== 1" class="pa-6" tile>
          <div class="headline">
            <span class="font-weight-medium">{{ pinnedNode.keyword.main }}</span>
            <span
              v-for="(subKeyword, index) in pinnedNode.keyword.sub"
              :key="index"
              class="font-weight-light"
            >, {{ subKeyword }}</span>
          </div>
        </v-sheet>
        <v-sheet v-if="pinnedNode.id !== 1" class="pa-6" tile dark color="grey darken-3">
          <div class="headline">
            <span class="font-weight-light">{{ pinnedNode.memo }}</span>
          </div>
        </v-sheet>
      </v-bottom-sheet>
      <!-- <node-detail-sheet :pinnedNode="pinnedNode" :project="project" :sheet="sheet" @update="updateSheet"></node-detail-sheet> -->
    </div>
  </v-flex>
</template>

<script>
import D3Network from 'vue-d3-network';
import jwtDecode from 'jwt-decode';
// import NodeDetailSheet from './NodeDetailSheet';

// 사용할 검색 엔진
const SEARCH_ENG = 'google';

export default {
  components: {
    D3Network
    // NodeDetailSheet
  },
  props: {
    project: {
      type: Object
    }
  },
  data () {
    return {
      prevURL: '',
      currURL: '',
      prevQuery: '',
      urlTextField: '',
      sheet: false,
      totalData: [],
      crawledData: {},
      nodes: [],
      links: [],
      nodeSize: 30,
      fontSize: 20,
      linkWidth: 5,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight - 130,
      nodeIndex: 0,
      intervalFunc: 0,
      isCrawlingStarted: false,
      pinnedNode: {
        id: 0,
        name: {
          host: '',
          rest: []
        },
        level: 0,
        paths: [],
        url: '',
        keyword: {
          main: '',
          sub: []
        },
        tagged: [],
        memo: ''
      }
    }
  },
  computed: {
    options () {
      return {
        force: 4000,
        size: { w: 800, h: 800 },
        nodeSize: this.nodeSize,
        fontSize: this.fontSize,
        linkWidth: this.linkWidth,
        nodeLabels: true,
        linkLabels: true,
        canvas: false
      }
    }
  },
  watch: {
    // 노드 클릭 시 나타나는 하단 정보 시트를 종료했을 경우 고정된 노드를 해제
    sheet (val) {
      if (!val) {
        var node = this.nodes.find(x => {
          return x.id === this.pinnedNode.id
        })
        this.nodes[node.id].fx = null
        this.nodes[node.id].fy = null
      }
    }
  },
  created () {
    // 루트 노드, etc. 노드 초기화
    this.addZeroNode()
    this.addInitialNodesAndLinks('', 'etc.')

    this.$http
      .get('/data', { params: { name: this.project.project_name } })
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
  mounted () {
    this.options.size.w = this.canvasWidth
    this.options.size.h = this.canvasHeight

    // // 로컬 저장소 값이 변경되었을 때 발생하는 이벤트
    // // https://www.experts-exchange.com/questions/29143892/How-to-Set-JavaScript-Event-Listener-on-Local-Storage-Value-in-Same-Window.html
    // window.addEventListener('storagechange', function(e) {
    //   if (e.detail.type == 'set') {
    //     console.log('LocalStorage value ' + e.detail.key + ' set to ' + e.detail.value);

    //     if (e.detail.key === 'currURL') {
    //       getCrawledData()
    //       // this.prevURL = localStorage.getItem('prevURL')
    //     }
    //   }
    // });
  },
  methods: {
    // 크롤링 시작 함수 (5초마다 크롤링 수행)
    startCrawling () {
      this.isCrawlingStarted = true
      this.intervalFunc = setInterval(() => {
        this.getCrawledData()
      }, 5000)

      window.open('https://www.google.com')
    },
    // 크롤링 중지 함수
    stopCrawling () {
      this.isCrawlingStarted = false
      clearInterval(this.intervalFunc)
    },
    // 자동 크롤링 수행 함수
    getCrawledData () {
      const decoded = jwtDecode(localStorage.getItem('userToken'))

      this.prevURL = localStorage.getItem('prevURL')
      this.currURL = localStorage.getItem('currURL')

      // prevURL을 이용하여 부모 노드를 검색
      var parentNode = this.nodes.find(node => {
        if (this.prevURL === '') {
          return node.name.split(' ')[1] === 'etc.';
        } else {
          return node.url === this.prevURL
        }
      })
      console.log(parentNode)

      var parentId = parentNode
        ? parentNode.id
        : this.prevURL === ''
          ? this.nodeIndex
            : 1
      var parentLevel = parentNode
        ? parentNode.level
          : 1

      // axios를 이용, 서버에 값 요청
      this.$http
        .post('/data/add', {
          userEmail: decoded.email,
          userName: decoded.first_name + ' ' + decoded.last_name,
          prevURL: this.prevURL,
          currURL: this.currURL,
          parentId,
          parentLevel
        })
        .then(response => {
          if (response.data.notUrl) {
            if (response.data.isMainPage) {
              // Google 메인 페이지인 경우 (DB에 저장되지 않음)
              this.crawledData.level = response.data.level
              this.crawledData.paths = response.data.paths
            } else {
              // 올바른 URL이 아닌 경우
              console.log('올바른 URL이 아닙니다.')
            }
          } else {
            this.crawledData = response.data

            // 불러온 데이터로부터 노드 생성 및 추가
            this.addNodesfromCrawledData(this.crawledData)
          }
        })
        .catch(err => {
          throw err
        })
    },
    // 모든 노드 삭제
    truncate () {
      if (confirm('모든 노드를 삭제하시겠습니까?')) {
        this.$http
          .delete('/data')
          .then(result => {
            this.nodes = []
            this.links = []
            this.nodeIndex = 0
            this.urlTextField = '';
            this.prevURL = '';
            this.prevQuery = '';

            // 루트 노드, etc. 노드 재생성
            this.addZeroNode()
            this.addInitialNodesAndLinks('', 'etc.')

            alert('모든 노드를 삭제했습니다.')
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 노드 초기화
    initializeNodes () {
      // 각 URL에 대해 진행
      this.totalData.forEach((item, index) => {
        this.addNodesfromCrawledData(item)
      })
    },
    // 크롤링한 데이터를 노드로 추가
    addNodesfromCrawledData (data) {
      var nodeLevel1 = '';

      // URL이 레벨 1인지 검사
      if (data.paths[0].indexOf('www.' + SEARCH_ENG) !== -1) {
        if (data.paths.length > 1) {
          nodeLevel1 = data.paths[1]
          this.prevQuery = nodeLevel1
          this.addInitialNodesAndLinks(data, nodeLevel1)
        } else {
          this.prevQuery = '';
        }
      } else {
        // 현재는 레벨 1 노드 접속 후 다른 웹사이트 접속 시 etc. 노드에 연결되지 않음
        // 추후에 검색 결과 페이지 내 prevURL과 일치하는 URL 링크가 있을 경우에만
        // 아래 코드를 실행하도록 작성

        if (this.prevURL.indexOf('www.' + SEARCH_ENG) !== -1) {
          // 이전 URL이 검색 결과 페이지일 경우
          nodeLevel1 = this.prevQuery
        } else {
          // 이전 URL이 없거나 일반 홈페이지일 경우
          // etc. 처리
          this.prevQuery = '';
          nodeLevel1 = 'etc.';
        }

        // 레벨 1 노드 및 간선 추가
        this.addInitialNodesAndLinks(data, nodeLevel1)

        // 레벨 2 이상일 경우 노드 및 간선 추가
        this.addNodesAndLinks(data)
      }
    },
    // 레벨 0 노드 추가
    addZeroNode () {
      this.nodes.push({
        id: this.nodeIndex++,
        name: this.project.topic,
        _color: 'blue',
        level: 0,
        fx: this.canvasWidth / 2,
        fy: this.canvasHeight / 2
      })
      this.nodes[0].pinned = true
    },
    // 레벨 1 노드 및 간선 추가
    addInitialNodesAndLinks (data, label) {
      var isPushed = false // 노드 중복 여부

      // 레벨 1 노드의 이름이 존재할 경우에만 노드 생성
      if (label === '') {
        isPushed = true
      } else {
        // 이미 존재하는 노드인지 검사
        this.nodes.forEach((item, index) => {
          if (item.level === 1) {
            if (item.name === `[1] ${label}`) {
              isPushed = true
            }
          }
        })
      }

      // 중복되는 노드가 없다면 새 노드 생성 및 간선 연결
      if (!isPushed) {
        this.nodes.push({
          id: this.nodeIndex++,
          name: `[1] ${label}`,
          _color: 'cyan',
          level: 1,
          url: label !== 'etc.' ? data.curr_url : label,
          paths: label !== 'etc.' ? data.paths : null,
          keyword: label !== 'etc.' ? data.keyword : '',
          subKeyword: label !== 'etc.' ? data.sub_keyword : '',
          tagged: label !== 'etc.' ? data.tagged : '',
          memo: label !== 'etc.' ? data.memo : '',
        })
        console.log(
          'Node created (idx, lv, name): ' +
            (this.nodeIndex - 1) +
            ', 1, ' +
            decodeURI(label)
        )

        this.links.push({
          sid: 0,
          tid: this.nodeIndex - 1,
          _svgAttrs: { 'stroke-width': 10, opacity: 1 }
        })
        console.log('Link created : 0 -> ' + (this.nodeIndex - 1))
      }
    },
    // 레벨 2 이후의 노드 및 간선 추가
    addNodesAndLinks (data) {
      var joinedURL = data.paths.join('')
      var duplicatedLinkTid = -1

      // 각 노드들과 비교하여 중복되는 이름의 노드가 존재하는지 검사
      var duplicatedNode = this.nodes.find(node => {
        return node.url === data.curr_url
      })

      // 중복된 노드가 있는 경우 간선까지 중복되는지 검사
      if (duplicatedNode) {
        var link = this.links.find(x => {
          return x.tid === duplicatedNode.id
        })
        if (link.sid === data.parent_id) {
          duplicatedLinkTid = link.tid
        }
      }

      if (duplicatedLinkTid === -1) {
        // 간선은 중복되지 않은 경우

        // 노드 이름 작명 함수
        var nodeNameConvention = (paths, url) => {
          var decodedURL = decodeURI(url)
          var decodedPaths = []
          var nodeName = []

          // paths 배열 URL 요소 디코딩
          for (var path of paths) {
            decodedPaths.push(decodeURI(path))
          }

          // URL 길이가 50자가 넘는지 검사
          if (decodedURL.length > 50) {
            nodeName.push(decodedPaths[0])

            // paths 배열 요소가 1개를 넘으면 '/...' 문자열 추가
            if (decodedPaths.length > 1) {
              nodeName.push('/...')

              // '/...' 문자열을 포함한 URL 전체가 50자를 넘지 않으면 가장 마지막 path 문자열 추가
              if (nodeName.join('').length <= 50) {
                nodeName.push(decodedPaths[decodedPaths.length - 1])
              }
            }
          } else {
            // URL 길이가 50자를 넘지 않는다면 있는 그대로 표시
            nodeName.push(decodedURL)
          }

          return nodeName.join('')
        };

        // 노드 생성
        this.nodes.push({
          id: this.nodeIndex++,
          name: `[${data.level}] ${nodeNameConvention(data.paths, joinedURL)}`,
          level: data.level,
          url: data.curr_url,
          paths: data.paths,
          keyword: data.keyword,
          subKeyword: data.sub_keyword,
          tagged: data.tagged,
          memo: data.memo
        })
        console.log(
          'Node created (idx, lv, name): ' +
            (this.nodeIndex - 1) +
            ', ' +
            data.level +
            ', ' +
            decodeURI(joinedURL)
        )

        // 간선 연결
        var sid = data.parent_id
        var tid = this.nodeIndex - 1
        this.links.push({ sid, tid })
        console.log('Link created : ' + sid + ' -> ' + tid)
      }
    },
    // 노드 클릭 시 이벤트
    nodeClick (event, node) {
      if (node.id !== 0) {
        node.fx = node.x
        node.fy = node.y
        this.savePinnedNode(node)
        // this.pinnedNode = node
        this.sheet = !this.sheet
      }
    },
    // 간선 클릭 시 이벤트
    linkClick (event, link) {
      console.log('selected: ' + link.sid + ' -> ' + link.tid)
    },
    // 선택된 노드에 대한 정보를 객체에 저장
    savePinnedNode (node) {
      this.pinnedNode.id = node.id
      this.pinnedNode.level = node.level
      this.pinnedNode.paths = node.paths
      this.pinnedNode.url =
        node.url !== 'etc.'
          ? decodeURI(node.url)
          : 'Google 검색 결과 페이지를 거치지 않고 접속한 페이지들이 하위 노드로 생성됩니다.';
      this.pinnedNode.name = {
        host:
          node.level > 1
            ? decodeURI(node.paths[0])
            : node.name.slice(node.name.indexOf(' ') + 1),
        rest: node.level > 1 ? decodeURI(node.paths.slice(1).join('')) : ''
      }
      this.pinnedNode.keyword.main = node.keyword
      this.pinnedNode.keyword.sub = node.subKeyword
      this.pinnedNode.tagged = node.tagged
      this.pinnedNode.memo = node.memo
    },
    // updateSheet () {
    //   this.sheet = !this.sheet
    // }
  }
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css">
</style>
