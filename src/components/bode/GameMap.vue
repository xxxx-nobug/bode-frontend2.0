<template>
  <div ref="parent" class="gamemap">
    <a-row>
      <div class="pkInfo" style="margin-bottom: 10px">
        <span style="margin-right: 670px">
          <a-popover placement="bottom">
            <template slot="content">
              <p>
                <a-avatar :src="leftUser.avatar" style="margin-right: 10px;"></a-avatar>
                {{leftUser.username}}
              </p>
              <p>分数：{{leftUser.rating}}</p>
              <p>胜场：{{leftUser.winCount}}</p>
              <p>对局总数：{{leftUser.pkCount}}</p>
            </template>
            <a-avatar style="backgroundColor:#9a5db0;" size="large">{{leftAvatarName}}</a-avatar>
          </a-popover>
        </span>
        <span>
          <a-popover placement="bottom">
            <template slot="content">
              <p>
                <a-avatar :src="rightUser.avatar" style="margin-right: 10px;"></a-avatar>
                {{rightUser.username}}
              </p>
              <p>分数：{{rightUser.rating}}</p>
              <p>胜场：{{rightUser.winCount}}</p>
              <p>对局总数：{{rightUser.pkCount}}</p>
            </template>
            <a-avatar style="backgroundColor:#F94848" size="large">{{rightAvatarName}}</a-avatar>
          </a-popover>
        </span>
      </div>
      <a-row>
        <canvas ref="canvas" tabindex="0" style="border-radius: 20px"></canvas>
      </a-row>
    </a-row>
  </div>
</template>

<script>
import {GameMap} from "@/assets/scripts/GameMap";
import {mapMutations} from "vuex";

export default {
  data() {
    return {
      leftAvatarName: 'Rival',
      rightAvatarName: 'Rival',
      leftUser: {
        username: this.$store.state.pk.opponentUsername,
        avatar: this.$store.state.pk.opponentAvatar,
        winCount: this.$store.state.pk.opponentWinCount,
        pkCount: this.$store.state.pk.opponentPkCount,
        rating: this.$store.state.pk.opponentRating
      },
      rightUser: {
        username: this.$store.state.pk.opponentUsername,
        avatar: this.$store.state.pk.opponentAvatar,
        winCount: this.$store.state.pk.opponentWinCount,
        pkCount: this.$store.state.pk.opponentPkCount,
        rating: this.$store.state.pk.opponentRating
      },
    }
  },
  mounted() {
    this.initCameMap()
    if (!this.$store.state.record.is_record) { // 如果当前是pk界面
      if (this.$store.state.pk.a_id === parseInt(this.$store.state.user.id)) { // 如果左下角的操作用户id是当前登录用户的id，则当前用户就是操作左下角蛇的
        this.leftUser = {...this.$store.state.user} // 覆盖对手的值
        this.leftAvatarName = 'Mine'
      } else { // 否则前用户就是操作右上角蛇的
        this.rightUser = {...this.$store.state.user}
        this.rightAvatarName = 'Mine'
      }
    } else { // 如果当前是显示对局界面
      this.leftAvatarName = 'UserA'
      this.rightAvatarName = 'UserB'
      this.leftUser = {...this.$store.state.record.userA}
      this.rightUser = {...this.$store.state.record.userB}
    }

  },
  methods: {
    ...mapMutations('pk', ['updateGameObject']),
    initCameMap() {
      this.updateGameObject(new GameMap(this.$refs.canvas.getContext('2d'), this.$refs.parent, this.$store))
    }
  }
}
</script>

<style scoped>
div.gamemap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
