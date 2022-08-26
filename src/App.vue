<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view/>
  </a-config-provider>
</template>

<script>
import {enquireScreen} from './utils/util'
import {mapState, mapMutations} from 'vuex'
import themeUtil from '@/utils/themeUtil'
import {getI18nKey} from '@/utils/routerUtil'
import {getInfo} from "@/services/user"

export default {
  name: 'App',
  data() {
    return {
      locale: {}
    }
  },
  created () {
    this.setHtmlTitle()
    this.setLanguage(this.lang)
    enquireScreen(isMobile => this.setDevice(isMobile))
  },
  mounted() {
   this.setWeekModeTheme(this.weekMode)
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    lang(val) {
      this.setLanguage(val)
      this.setHtmlTitle()
    },
    $route() {
      this.getUserInfo() // 每次刷新页面调用该方法获取登录用户信息
      this.setHtmlTitle()
    },
    'theme.mode': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
    },
    'theme.color': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
    },
    'layout': function() {
      window.dispatchEvent(new Event('resize'))
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    ...mapMutations('user', ['setUser', 'setPullingInfo', 'setToken']),
    // 每次刷新页面/切换页面时调用获取当前登录用户信息，并把用户信息存放到全局变量store的user.js中
    getUserInfo() {
      // 校验当前是否在登录状态
      const jwt_token = localStorage.getItem('jwt_token')
      if (jwt_token) {
        this.setToken(jwt_token)
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
      } else { // 如果不在登录状态
        this.setPullingInfo(false)
      }
    },
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
          break
        case 'HK':
          this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
          break
        case 'US':
        default:
          this.locale = require('ant-design-vue/es/locale-provider/en_US').default
          break
      }
    },
    setHtmlTitle() {
      const route = this.$route
      const key = route.path === '/' ? 'home.name' : getI18nKey(route.matched[route.matched.length - 1].path)
      document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key)
    },
    popContainer() {
      return document.getElementById("popContainer")
    }
  }
}
</script>

<style lang="less" scoped>
  #id{
    //background-image: url("./assets/img/back03.png");
    //background-size: cover;
  }
  //body {
  //  background-image: url('./assets/img/back03.png');
  //  background-size: cover;
  //}
</style>
