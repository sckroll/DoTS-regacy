<template>
  <v-flex>
    <v-container>
      <v-row class="mt-5">
        <v-col cols="10" class="pa-0">
          <v-text-field
            @keyup.enter="submit"
            v-model="urlTextField"
            label="URL을 입력하면 임시 크롤링 정보와 시각화 정보가 출력됩니다."
            single-line
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="1" class="pa-0">
          <v-btn color="blue darken-4 white--text" height="48" tile @click="onSubmit">
            크롤링
            <br />시작
          </v-btn>
        </v-col>
        <v-col cols="1" class="pa-0">
          <v-btn color="warning" height="48" tile @click="truncate">초기화</v-btn>
        </v-col>
      </v-row>
    </v-container>

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
        <v-sheet class="pa-6" height="200px" tile>
          <div class="headline">
            <span class="font-weight-light">노드 ID:</span>
            <span class="font-weight-medium ml-2">{{ pinnedNode.id }}</span>
            <br />
            <span class="font-weight-light">노드 레벨:</span>
            <span class="font-weight-medium ml-2">{{ pinnedNode.level }}</span>
          </div>
        </v-sheet>
      </v-bottom-sheet>
      <!-- <node-detail-sheet :sheet="sheet"></node-detail-sheet> -->
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
      mainTopic: this.project.topic,
      nodes: [],
      links: [],
      nodeSize: 30,
      fontSize: 20,
      linkWidth: 5,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight - 200,
      nodeIndex: 0,
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
        foundUser: [],
        memo: '',
        marked: []
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
    // 레벨 0 노드 초기화
    this.addZeroNode()

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
        const decoded = jwtDecode(localStorage.getItem('userToken'))
        this.currURL = value

        // prevURL을 이용하여 부모 노드를 검색
        // (추후에 크롬 API 연동 과정에서 document.referrer로 대체)
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
            : 0
        var parentLevel = parentNode
          ? parentNode.level
          : this.prevURL === ''
            ? 1
            : 0

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

                this.prevURL = '';
              } else {
                // 올바른 URL이 아닌 경우
                alert('올바른 URL이 아닙니다.')
                this.urlTextField = '';
              }
            } else {
              this.crawledData = response.data

              // 불러온 데이터로부터 노드 생성 및 추가
              this.addNodesfromCrawledData(this.crawledData)

              this.prevURL = this.currURL
            }
          })
          .catch(err => {
            throw err
          })
      } else {
        this.currURL = '';
      }
    },
    onSubmit () {
      var val = this.urlTextField ? this.urlTextField : '';
      this.submit(val)
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

            this.addZeroNode()

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
          this.addInitialNodesAndLinks(nodeLevel1, data.curr_url)
        } else {
          this.prevQuery = '';
        }
      } else {
        // 현재는 레벨 1 노드 접속 후 다른 웹사이트 접속 시 etc. 노드에 연결되지 않음
        // 추후에 검색 결과 페이지 내 prevURL과 일치하는 URL 링크가 있을 경우에만
        // 아래 코드를 실행하도록 작성
        if (this.prevURL.indexOf('www.' + SEARCH_ENG) !== -1) {
          // if (this.prevQuery) {
          console.log('레벨 1 노드로부터 이동')
          nodeLevel1 = this.prevQuery
          // }
        } else {
          // etc. 처리
          this.prevQuery = '';
          nodeLevel1 = 'etc.';
          // if (this.prevQuery) {
          //   nodeLevel1 = this.prevQuery
          // } else {
          //   this.prevQuery = '';
          //   nodeLevel1 = 'etc.';
          // }
        }

        // 레벨 1 노드 및 간선 추가
        this.addInitialNodesAndLinks(nodeLevel1, data.curr_url)

        // 레벨 2 이상일 경우 노드 및 간선 추가
        this.addNodesAndLinks(data)
      }
    },
    // 레벨 0 노드 추가
    addZeroNode () {
      this.nodes.push({
        id: this.nodeIndex++,
        name: this.mainTopic,
        _color: 'blue',
        level: 0,
        fx: this.canvasWidth / 2,
        fy: this.canvasHeight / 2
      })
      this.nodes[0].pinned = true
    },
    // 레벨 1 노드 및 간선 추가
    addInitialNodesAndLinks (label, url) {
      var isPushed = false // 노드 중복 여부

      // 이미 존재하는 노드인지 검사
      this.nodes.forEach((item, index) => {
        if (item.level === 1) {
          if (item.name === `[1] ${label}`) {
            isPushed = true
          }
        }
      })

      // 중복되는 노드가 없다면 새 노드 생성 및 간선 연결
      if (!isPushed) {
        this.nodes.push({
          id: this.nodeIndex++,
          name: `[1] ${label}`,
          _color: 'cyan',
          level: 1,
          url: label === 'etc.' ? label : url
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
        return node.name.split(' ')[1] === joinedURL
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
        // 노드 생성
        this.nodes.push({
          id: this.nodeIndex++,
          name: `[${data.level}] ${decodeURI(joinedURL)}`,
          level: data.level,
          url: data.curr_url,
          paths: data.paths
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
      alert('selected: ' + link.sid + ' -> ' + link.tid)
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
    }
  }
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css">
</style>
