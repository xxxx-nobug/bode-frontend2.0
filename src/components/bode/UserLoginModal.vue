<template>
  <div>
    <a-modal centered :footer="null" v-model="visible" title="" on-ok="handleOk">
      <div class="top" style="text-align: center; margin-bottom: 10px">
        <div class="header">
          <span class="title">{{systemName}}</span>
        </div>
        <div class="desc">史诗级模拟AI对战平台</div>
      </div>
      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
            <a-tab-pane tab="用户名密码登录" key="1">
              <a-alert type="error" :closable="true" v-if="error" :message="error" @close='onClose' showIcon style="margin-bottom: 24px;" />
              <a-form-item>
                <a-input
                    autocomplete="autocomplete"
                    size="large"
                    placeholder="用户名"
                    v-decorator="['username', {rules: [{ required: true, message: '请输入用户名', whitespace: true}]}]"
                >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                    size="large"
                    placeholder="密码"
                    autocomplete="autocomplete"
                    type="password"
                    v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
                >
                  <a-icon slot="prefix" type="lock" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
          <div style="text-align: right">
            <a-button type="link" size="small" @click="toRegisterModal">注册账户</a-button>
          </div>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <UserRegisterModal ref="userRegisterModal"/>
  </div>
</template>

<script>

import {getInfo, login} from "@/services/user";
import {mapMutations} from "vuex";
import UserRegisterModal from "@/components/bode/UserRegisterModal";

export default {
  name: "UserLoginModal",
  components: {UserRegisterModal},
  data() {
    return {
      visible: false,
      logging: false,
      error: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('user', ['setUser', 'setToken']),
    showModal() {
      this.visible = true;
    },
    resetModal() {
      // 清空表单信息
      this.form.resetFields()
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const username = this.form.getFieldValue('username')
          const password = this.form.getFieldValue('password')
          login(username, password).then(this.afterLogin)
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      if (res.code === 20000) {
        // 设置token
        this.setToken(res.data)
        // 设置当前登录用户信息
        getInfo().then(userInfo => {
          if (userInfo.code === 20000) {
            this.setUser({
              ...userInfo.data,
              is_login: true
            })
            this.visible = false
          }
        }).catch(userInfo => {
          this.$message.error(userInfo.description)
        })
      } else {
        this.$message.error(res.description)
      }
    },
    toRegisterModal() {
      this.visible = false
      this.$refs.userRegisterModal.showModal()
    },
    onClose() {
      this.error = false
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    font-size: 33px;
    color: @title-color;
    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
  }
</style>
