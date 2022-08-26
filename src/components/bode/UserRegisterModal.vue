<template>
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
          <a-tab-pane tab="注册" key="1">
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
            <a-form-item>
              <a-input
                  size="large"
                  placeholder="确认密码"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['verifyPassword', {rules: [{ required: true, message: '请确认密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import {register} from "@/services/user";

export default {
  name: "UserRegisterModal",
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
          const username = this.form.getFieldValue('username') // 用的时候再打开
          const password = this.form.getFieldValue('password')
          const verifyPassword = this.form.getFieldValue('verifyPassword')
          // 注册密码逻辑：
          if (verifyPassword !== password) {
            this.$message.error('密码和确认密码不相同')
            this.logging = false
          } else {
            // 注册请求
            register(username, password, verifyPassword).then(res => {
              if (res.code === 20000) {
                this.$message.success('注册成功')
                this.visible = false
              } else {
                this.$message.error(res.description)
                this.logging = false
                return
              }
            }).catch(res => {
              this.$message.error(res.description)
            })
          }
        }
      })
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
