<template>
  <div>
    <PlayGround v-if="$store.state.pk.status === 'playing'" />
    <MatchGround v-if="$store.state.pk.status === 'matching'" />
    <ResultBoard v-if="$store.state.pk.loser !== 'none'" />
  </div>
</template>

<script>
import PlayGround from "@/components/bode/PlayGround"
import MatchGround from "@/components/bode/MatchGround"
import ResultBoard from "@/components/bode/ResultBoard";
import {mapMutations} from "vuex"
export default {
  name: "PkIndexView",
  components: {MatchGround, PlayGround, ResultBoard},
  data() {
    return {
      socket: null
    }
  },
  mounted() {
    this.connectOptions() // websocket连接相关操作
  },
  beforeDestroy() {
    this.stopConnection() // websocket端口连接操作
  },
  methods: {
    ...mapMutations('pk', ['updateSocket', 'updateOpponent', 'updateStatus', 'updateGame', 'updateLoser']),

    // 加载该pk页面时和后端建立连接
    connectOptions() {
      this.updateLoser('none') // 切换到pk界面时状态更新
      // 匹配前设置对手默认信息
      this.updateOpponent({
        username: "我的对手",
        avatar: "http://picture.treehole.fun/img/202208131519579.png",
        winCount: '0',
        pkCount: '0',
        rating: '0'
      })
      this.socket = new WebSocket(`ws://127.0.0.1:8090/service/basic/websocket/${this.$store.state.user.token}/`) // 创建webSocket服务对象
      this.socket.onopen = () => {
        console.log("connected to backend...")
        this.updateSocket(this.socket) // 设置当前连接的服务
      }
      // 接收后端传来的连接信息
      this.socket.onmessage = msg => {
        const data = JSON.parse(msg.data) // 获取信息并解析
        // 后端返回消息
        if (data.event === "matching-success") {  // 后端匹配用户成功，返回了匹配信息
          this.updateOpponent({ // 设置对手信息
            username: data.opponentUsername,
            avatar: data.opponentAvatar,
            winCount: data.opponentWinCount,
            pkCount: data.opponentPkCount,
            rating: data.opponentRating
          })
          this.updateStatus('playing')
          // 设置地图和游戏基本信息
          this.updateGame(data.game) // game中有地图信息和A、B两条蛇的信息
        } else if (data.event === "move") { // 如果是移动
          const game = this.$store.state.pk.gameObject // 获取游戏信息（gameObject在GameMap.vue中初始化）
          const [snake0, snake1] = game.snakes // 该局游戏中的两个用户操控的蛇赋予游戏信息中的值（给GameMap.js中的两条蛇赋值）
          snake0.set_direction(data.a_direction) // 设置两条蛇的移动
          snake1.set_direction(data.b_direction)
        } else if (data.event === "result") { // 如果是结果信息
          const game = this.$store.state.pk.gameObject
          const [snake0, snake1] = game.snakes

          if (data.loser === "all" || data.loser === "A") {
            snake0.status = "die"
          }
          if (data.loser === "all" || data.loser === "B") {
            snake1.status = "die"
          }
          this.updateLoser(data.loser)
        }
      }
      // 结束连接
      this.socket.onclose = () => {
        console.log("disconnected...")
      }
    },
    stopConnection() {
      this.socket.close();
      this.updateStatus('matching')
    }
  }
}
</script>

<style scoped>

</style>
