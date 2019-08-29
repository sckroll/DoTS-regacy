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
        <v-sheet class="text-center" height="200px">
          <div class="py-3">
            <div class="node-name display-1">{{ pinnedNode.name }}</div>
            <div class="node-info headline">
              <span class="node-level font-weight-light px-10">노드 레벨: {{ pinnedNode.level }}</span>
              <span class="node-id font-weight-light px-10">노드 ID: {{ pinnedNode.id }}</span>
            </div>
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
  data () {
    return {
      prevURL: '',
      currURL: '',
      prevQuery: '',
      urlTextField: '',
      isValueRequested: false,
      isDataLoaded: false,
      sheet: false,
      totalData: [],
      crawledData: {},
      mainTopic: 'Main Topic',
      nodes: [],
      links: [],
      nodeSize: 30,
      fontSize: 20,
      linkWidth: 5,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      nodeIndex: 0,
      pinnedNode: {
        id: 0,
        name: '',
        level: 0,
        path: [],
        url: ''
      }
    }
  },
  computed: {
    options () {
      return {
        force: 4000,
        // forces: {
        //   X: 0.5,
        //   Y: 0.5,
        //   ManyBody: true,
        //   Center: true
        // },
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
              this.addNodesfromCrawledData(this.crawledData)

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
      if (confirm('모든 노드를 삭제하시겠습니까?')) {
        this.$http
          .get('/data/delete')
          .then(result => {
            this.nodes = []
            this.links = []
            this.nodeIndex = 0
            this.isValueRequested = false
            this.isDataLoaded = false
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
        } else {
          nodeLevel1 = SEARCH_ENG
          this.prevQuery = '';
        }

        this.addInitialNodesAndLinks(nodeLevel1)
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
        // sourceId: 레벨 2 이후의 노드가 생성될 기반 노드
        var sourceId = this.addInitialNodesAndLinks(nodeLevel1)

        // 레벨 2 이상일 경우 노드 및 간선 추가
        this.addNodesAndLinks(data, sourceId)
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
    addInitialNodesAndLinks (label) {
      var isPushed = false // 노드 중복 여부
      var sourceId = 0 // 레벨 2 이후 노드가 생성될 기반 노드

      // 이미 존재하는 노드인지 검사
      this.nodes.forEach((item, index) => {
        if (item.level === 1) {
          if (item.name === `[1] ${label}`) {
            isPushed = true
            sourceId = item.id
          }
        }
      })

      // 중복되는 노드가 없다면 새 노드 생성 및 간선 연결
      if (!isPushed) {
        this.nodes.push({
          id: this.nodeIndex++,
          name: `[1] ${label}`,
          _color: 'cyan',
          level: 1
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

        sourceId = this.nodeIndex - 1
      }

      return sourceId
    },
    // 레벨 2 이후의 노드 및 간선 추가
    addNodesAndLinks (data, sourceId) {
      var prevNodeId = sourceId

      data.paths.forEach((item, index) => {
        var duplicatedLinkTid = -1

        // 각 노드들과 비교하여 중복되는 이름의 노드가 존재하는지 검사
        var duplicatedNode = this.nodes.find(node => {
          return node.name.split(' ')[1] === item
        })

        // 중복된 노드가 있는 경우 간선까지 중복되는지 검사
        if (duplicatedNode) {
          var link = this.links.find(x => {
            return x.tid === duplicatedNode.id
          })
          if (link.sid === prevNodeId) {
            duplicatedLinkTid = link.tid
          }
        }

        if (duplicatedLinkTid === -1) {
          // 간선은 중복되지 않은 경우
          // 노드 생성
          this.nodes.push({
            id: this.nodeIndex++,
            name: `[${index + 2}] ${decodeURI(item)}`,
            level: index + 2
          })
          console.log(
            'Node created (idx, lv, name): ' +
              (this.nodeIndex - 1) +
              ', ' +
              (index + 2) +
              ', ' +
              decodeURI(item)
          )

          // 간선 연결
          var sid = prevNodeId
          var tid = this.nodeIndex - 1
          this.links.push({ sid, tid })
          console.log('Link created : ' + sid + ' -> ' + tid)

          prevNodeId = tid
        } else {
          // 간선도 중복되는 경우
          prevNodeId = duplicatedLinkTid
        }
      })
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
      this.pinnedNode.name = node.name.split(' ')[1]
      this.pinnedNode.level = node.level
      this.pinnedNode.path = []
      this.pinnedNode.url = '';
    }
  }
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css">
</style>
