<template>
  <div>
    <a-dropdown>
      <div class="header-avatar" style="cursor: pointer">
        <a-avatar class="avatar" size="small" shape="circle" :src="$store.state.user.avatar"/>
        <span class="name">{{$store.state.user.username}}</span>
      </div>
      <a-menu :class="['avatar-menu']" slot="overlay">
        <a-menu-item>
          <router-link  to="/user/bot">
            <a-icon style="margin-right: 8px;" type="user" />
            <span>我的Bot</span>
          </router-link>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item @click="logout">
          <a-icon style="margin-right: 8px;" type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>

</template>

<script>
import {mapGetters} from 'vuex'
import {logout} from '@/services/user'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      logout()
      this.$router.push('/pk')
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
