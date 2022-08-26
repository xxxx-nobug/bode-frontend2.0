<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
<!--        <img width="32" src="@/assets/img/logo.png" />-->
        <h1 id="logoFont" v-if="!isMobile">{{systemName}}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/>
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect"/>
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <header-avatar class="header-item" v-if="$store.state.user.is_login"/>

        <!--当既没有登录也没有处在获取信息状态时显示登录注册-->
        <div v-if="!$store.state.user.is_login && !$store.state.user.pulling_info">
          <a-button type="link" ghost @click="showLoginModal">
            登录
          </a-button>
          |
          <a-button type="link" ghost @click="showRegisterModal">
            注册
          </a-button>
        </div>
      </div>
    </div>
    <!--登录和注册的模态窗口组件-->
    <UserLoginModal ref="userLoginModal"/>
    <UserRegisterModal ref="userRegisterModal"/>
  </a-layout-header>
</template>

<script>
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import {mapState, mapMutations} from 'vuex'
import UserLoginModal from "@/components/bode/UserLoginModal";
import UserRegisterModal from "@/components/bode/UserRegisterModal";

export default {
  name: 'AdminHeader',
  components: {UserRegisterModal, UserLoginModal, IMenu, HeaderAvatar},
  props: ['collapsed', 'menuData'],
  data() {
    return {
      searchActive: false
    }
  },
  mounted() {
    // 如果没有登录，则每次刷新页面显示登录模态窗口
    if (!localStorage.getItem('jwt_token')) {
      this.showLoginModal()
    }
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
    headerTheme () {
      if (this.layout === 'side' && this.theme.mode === 'dark' && !this.isMobile) {
        return 'light'
      }
      return this.theme.mode
    },
    langAlias() {
      let lang = this.langList.find(item => item.key === this.lang)
      return lang.alias
    },
    menuWidth() {
      const {layout, searchActive} = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    // 显示登录的模态窗口
    showLoginModal() {
      this.$refs.userLoginModal.showModal()
      this.$refs.userLoginModal.resetModal()
    },
    // 显示注册的模态窗口
    showRegisterModal() {
      this.$refs.userRegisterModal.showModal()
      this.$refs.userRegisterModal.resetModal() // 重置上次提交的表单
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    ...mapMutations('setting', ['setLang'])
  }
}
</script>

<style lang="less" scoped>
@import "index";

#logoFont {
  font-size: 23px !important;
  font-family: 'Impact' !important;
  margin-top: 2px !important;
}
// 登录注册标签的默认颜色
.ant-btn > a:only-child {
  color: rgba(0, 0, 0, 0.65);
}
// 登录注册标签的默认颜色和hover颜色设置
.ant-btn-background-ghost.ant-btn-link {
  //color: #1890ff;
  color: rgba(0, 0, 0, 0.65);
}
.ant-btn-background-ghost.ant-btn-link:hover, .ant-btn-background-ghost.ant-btn-link:focus {
  border-color: transparent;
  color: #40a9ff;
}
</style>
