<template>
  <v-flex>
    <v-text-field @keyup.enter="submit" label="URL을 입력하세요" single-line solo clearable></v-text-field>
    <div v-if="isValueRequested">
      <span class="headline font-weight-light">다음의 URL로 접속합니다.</span>
      <br />
      <span class="headline font-weight-medium">{{ decodeURI(urlValue) }}</span>

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
        <div id="node">
          <d3-network :net-nodes="nodes" :net-links="links" :options="options" />
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
  </v-flex>
</template>

<script>
import D3Network from "vue-d3-network";
import jwtDecode from "jwt-decode";

// 사용할 검색 엔진
const SEARCH_ENG = "google";

export default {
  components: {
    D3Network
  },
  data() {
    return {
      urlValue: "",
      isValueRequested: false,
      isDataLoaded: false,
      crawledData: {},
      mainTopic: "Main Topic",
      nodes: [],
      links: [],
      nodeSize: 40,
      fontSize: 20,
      canvas: false
    };
  },
  computed: {
    options() {
      return {
        force: 4000,
        size: { w: 800, h: 600 },
        nodeSize: this.nodeSize,
        fontSize: this.fontSize,
        nodeLabels: true,
        linkLabels: true,
        canvas: this.canvas
      };
    }
  },
  methods: {
    submit(val) {
      if (val.target.value !== "") {
        this.urlValue = val.target.value;
        this.isValueRequested = true;

        const decoded = jwtDecode(localStorage.getItem("userToken"));

        // axios를 이용, 서버에 값 요청
        this.$http
          .post("/data", {
            userEmail: decoded.email,
            userName: decoded.first_name + " " + decoded.last_name,
            url: this.urlValue
          })
          .then(response => {
            if (response.data.notUrl) {
              this.isDataLoaded = false;
            } else {
              this.crawledData = response.data;
              this.isDataLoaded = true;

              // 이전에 만든 노드가 있다면 노드 삭제
              this.nodes = [];
              this.links = [];

              // 노드 초기화
              this.initializeNodes();
            }
          });
      } else {
        this.urlValue = "";
        this.isValueRequested = false;
      }
    },
    // 노드 초기화
    initializeNodes() {
      var nodeLevel1 = "";

      this.nodes.push({ id: 0, name: this.mainTopic, _color: "blue" });

      // URL이 레벨 1인지 검사
      if (this.crawledData.paths[0].indexOf("www." + SEARCH_ENG) != -1) {
        if (this.crawledData.paths.length > 1) {
          nodeLevel1 = this.crawledData.paths[1];
        } else {
          nodeLevel1 = SEARCH_ENG;
        }

        this.addInitialNodesAndLinks(nodeLevel1);
      } else {
        nodeLevel1 = "etc.";

        this.addInitialNodesAndLinks(nodeLevel1);

        // 레벨 2 이상일 경우 노드 및 간선 추가
        this.addNodes();
        this.addLinks();
      }
    },
    // 레벨 1 노드 및 간선 추가
    addInitialNodesAndLinks(label) {
      this.nodes.push({ id: 1, name: `[1] ${label}`, _color: "cyan" });
      this.links.push({
        sid: 0,
        tid: 1,
        _svgAttrs: { "stroke-width": 8, opacity: 1 }
      });
    },
    // 노드 추가
    addNodes() {
      this.crawledData.paths.forEach((item, index) => {
        this.nodes.push({
          id: index + 2,
          name: `[${index + 2}] ${decodeURI(item)}`
        });
      });
    },
    // 간선 추가
    addLinks() {
      this.crawledData.paths.forEach((item, index) => {
        this.links.push({ sid: index + 1, tid: index + 2 });
      });
    }
  }
};
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
