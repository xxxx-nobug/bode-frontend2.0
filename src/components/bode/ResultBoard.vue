<template>
    <div class="result-board">
        <div class="result-board-text" v-if="$store.state.pk.loser === 'all'">
            DRAW
        </div>
        <div class="result-board-text" v-else-if="$store.state.pk.loser === 'A' && $store.state.pk.a_id === parseInt($store.state.user.id)">
          DEFEATED
        </div>
        <div class="result-board-text" v-else-if="$store.state.pk.loser === 'B' && $store.state.pk.b_id === parseInt($store.state.user.id)">
          DEFEATED
        </div>
        <div class="result-board-text" v-else>
          VICTORY
        </div>
        <div class="result-board-btn">
            <a-button  @click="restartGame" type="primary" size="large">
                再来一局
            </a-button>
        </div>
    </div>
</template>

<script>

import {mapMutations} from "vuex";
import {getInfo} from "@/services/user";

export default {
  mounted() {
  },
  methods: {
    ...mapMutations('pk', ['updateStatus', 'updateLoser', 'updateOpponent']),
    ...mapMutations('user', ['setUser', 'setPullingInfo', 'setToken']),
    restartGame() {
      this.updateLoser('none')
      this.updateStatus('matching')
      this.updateOpponent({
        username: "我的对手",
        avatar: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
        winCount: '0',
        pkCount: '0',
        rating: '0'
      })
      getInfo().then(res => {
        if (res.code === 20000) {
          // 存放用户信息
          this.setUser({
            ...res.data,
            is_login: true
          })
          // router.push({ name: "home" })
          this.setPullingInfo(false)
        } else {
          this.setPullingInfo(false)
        }
      }).catch(() => {
        this.setPullingInfo(false)
      })
    }
  },
}
</script>

<style scoped>
div.result-board {
    border-radius: 10px;
    height: 30vh;
    width: 30vw;
    background-color: rgba(50, 50, 50, 0.5);
    position: fixed;
    top: 30vh;
    left: 35vw;
}
div.result-board-text {
    text-align: center;
    color: white;
    font-size: 50px;
    font-weight: 600;
    font-style: italic;
    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
    padding-top: 5vh;
}

div.result-board-btn {
    padding-top: 7vh;
    text-align: center;
}
</style>
