<template>
  <div>
    <a-card style="border-radius: 20px" title="编辑个人信息" >
      <a-button slot="extra" type="primary" @click="back">
        返回
      </a-button>
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :colon="false" label="用户名">
          <a-input  v-decorator="['username', { initialValue: userInfo.username, rules: [
            { required: true, message: '请输入用户名' }], }]"/>
        </a-form-item>
        <a-form-item :colon="false" label="电话">
          <a-input v-model="userInfo.phone"/>
        </a-form-item>
        <a-form-item :colon="false" label="邮箱">
          <a-input v-model="userInfo.email"/>
        </a-form-item>
        <a-form-item :colon="false" label="性别">
          <a-radio-group v-model="userInfo.gender">
            <a-radio :value="0">男</a-radio>
            <a-radio :value="1">女</a-radio>
            <a-radio :value="-1">保密</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :colon="false" label="简介">
          <a-textarea v-model="userInfo.profile" />
        </a-form-item>
        <a-form-item :colon="false" label="头像">
          <!--属性action上传图片接口，返回一个图片url-->
          <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="http://localhost:8090/service/basic/file/upload"
              :before-upload="beforeUpload"
              @change="handleChange"
              :headers="headers"
          >
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像" style="width: 100%"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-button html-type="submit">保存修改</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>

import userStore from "@/store/modules/user";
import {updateMyInfo} from "@/services/user";

let isFormRight = false // 用于表单验证

export default {
  name: "EditUserInfoView",
  data() {
    return {
      form: this.$form.createForm(this, { name: 'editUserFrom' }), // 表单
      usernameForm: "", // 表单的username赋值对象（不能直接赋值给userInfo.username，因为它的改变会影响store中的数据，所以额外定义变量接收）
      userInfo: {}, // 用户信息
      loading: false, // 上传图片加载
      headers: { // 上传图片请求头
        Authorization: "Bearer " + userStore.state.token,
      }
    }
  },
  created() {
    // 用户未登录禁止访问
    if (!this.$store.state.user.is_login) {
      this.$message.error('请先登录')
      this.$router.push('/')
    }
    // 初始化user信息
    this.setUserInfo()
  },
  methods: {
    // 设置user信息
    setUserInfo() {
      this.userInfo = this.$store.state.user
    },
    // 获取form表单数据
    getFormData() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 获取表单数据
          this.usernameForm = values.username
          isFormRight = true
        }
      });
    },
    // 页面回退方法
    back() {
      this.$router.back()
    },
    // 表单提交
    handleSubmit() {
      this.getFormData()
      // 表单提交
      if (!isFormRight) { // 如果表单有require数据未填
        return
      }
      // 设置请求参数
      let userFormData = {
        id: this.userInfo.id,
        username: this.usernameForm,
        phone: this.userInfo.phone,
        email: this.userInfo.email,
        gender: this.userInfo.gender,
        profile: this.userInfo.profile,
        avatar: this.userInfo.avatar
      }
      // 发送更新请求
      updateMyInfo(userFormData).then(res => {
        if (res.code === 20000) {
          this.$message.success('修改成功')
          this.$router.push('/user/bot')
        } else {
          this.$message.error(res.description)
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 上传图片执行操作
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true; // 上传图片加载
        return;
      }
      if (info.file.status === 'done') {
        this.userInfo.avatar = info.file.response.data // 设置图片url
        this.loading = false;
      }
      if (info.file.status === 'error') {
        this.loading = false;
        this.$message.error('图片上传失败')
        return;
      }
    },
    // 上传前判断图片是否合规
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpeg和png格式图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小需要小于2MB');
      }
      return isJpgOrPng && isLt2M;
    }
  }
}
</script>

<style scoped>

</style>
