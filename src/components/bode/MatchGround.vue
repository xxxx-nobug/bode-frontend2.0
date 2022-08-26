<template>
  <div>
    <div class="matchGround">
      <a-row type="flex" justify="center">
        <a-col :span="8">
          <div class="user-avatar">
            <img :src="$store.state.user.avatar ? $store.state.user.avatar : 'http://picture.treehole.fun/img/202208131519579.png'" alt="">
          </div>
          <div class="user-username">
            {{ $store.state.user.username ? $store.state.user.username : '未登录' }}
            <br/>
            分数：{{$store.state.user.username ? $store.state.user.rating : 0}}
            <br/>
            胜场：{{$store.state.user.username ? $store.state.user.winCount : 0}}
            <br/>
            总场数：{{$store.state.user.username ? $store.state.user.pkCount : 0}}
          </div>
        </a-col>
        <a-col :span="8">
          <div class="vsImg">
            <img src="@/assets/img/vs-01.png" alt=""/>
          </div>
          <div style="text-align: center; padding-top: 50vh;">
            <a-select
                :default-value="defaultBotTitle"
                show-search
                placeholder="选择你的bot"
                option-filter-prop="children"
                style="width: 200px; margin-bottom: 30px;"
                :filter-option="filterOption"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            >
              <a-select-option value="-1">
                亲自出马
              </a-select-option>
              <a-select-option v-for="bot in botList" :key="bot.id">
                {{bot.title}}
              </a-select-option>
            </a-select>
            <br/>
            <a-button type="primary" size="large" @click="clickMatchBtn">{{ matchBtnInfo }}</a-button>
            <br/>
            <a-spin :spinning="spinning" tip="匹配中..." style="margin-top: 20px"/>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="user-avatar">
            <img :src="$store.state.pk.opponentAvatar" alt="" >
          </div>
          <div class="user-username">
            {{ $store.state.pk.opponentUsername }}
            <br/>
            分数：{{$store.state.pk.opponentRating}}
            <br/>
            胜场：{{$store.state.pk.opponentWinCount}}
            <br/>
            总场数：{{$store.state.pk.opponentPkCount}}
          </div>
        </a-col>
      </a-row>
    </div>
    <UserLoginModal ref="userLoginModal"/>
  </div>
</template>

<script>
import UserLoginModal from "@/components/bode/UserLoginModal"
import {getBotList} from "@/services/bot";
export default {
  name: "MatchGround",
  components: {UserLoginModal},
  data() {
    return {
      matchBtnInfo: "开始匹配",
      spinning: false,
      botList: [],
      defaultBotTitle: "亲自出马",
      selectBotValue: "-1" // -1代表亲自战斗
    }
  },
  methods: {
    clickMatchBtn() {
      // 判断当前用户是否已经登录
      if (!this.$store.state.user.is_login) {
        this.$notification['warning']({
          message: '请先登录',
          description: 'BODE模拟AI对战平台，让你享受编程对战的乐趣',
        })
        this.$refs.userLoginModal.showModal()
        this.$refs.userLoginModal.resetModal()
        return
      }
      if (this.matchBtnInfo === "开始匹配") {
        this.matchBtnInfo = "取消"
        this.spinning = true
        this.$store.state.pk.socket.send(JSON.stringify({
          event: "start-matching", // 向后端发送开始匹配请求
          bot_id: this.selectBotValue // 选择bot的id(选择框进行选择所有bot或者亲自参战)
        }))
      } else {
        this.matchBtnInfo = "开始匹配"
        this.spinning = false
        this.$store.state.pk.socket.send(JSON.stringify({
          event: "stop-matching", // 向后端发送停止匹配请求
        }))
      }
    },
    // 选择框选择bot
    // 获取所有bot
    fetchBotData() {
      getBotList(1, -1).then(res => {
        if (res.code === 20000) {
          this.botList = res.data.records
        } else {
          console.log(res)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    handleChange(value) {
      this.selectBotValue = value
    },
    handleBlur() {
      console.log('blur')
    },
    handleFocus() {
      console.log('focus')
      this.fetchBotData(); // 当搜索框获取焦点时才搜索所有数据
    },
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
}
</script>

<style scoped>
div.matchGround {
  width: 60vw;
  height: 70vh;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 20px;
}
div.user-avatar {
  text-align: center;
  padding-top: 10vh;
}
div.user-avatar > img {
  border-radius: 50%;
  width: 20vh;
}
div.vsImg > img {
  border-radius: 50%;
  width: 100%;
  position: absolute;
  margin-top: 40px;

}
div.user-username {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #505050;
  padding-top: 2vh;
}
</style>
