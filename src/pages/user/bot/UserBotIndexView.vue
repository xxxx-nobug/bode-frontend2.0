<template>
  <div>
    <a-row type="flex">
      <a-col flex="100px">
        <a-avatar :size="120" shape="square" :src="$store.state.user.avatar" style="border-radius: 15px"/>
      </a-col>
      <a-col flex="700px" style="margin-left: 25px; text-align: left">
        <a-space direction="vertical">
          <strong style="font-size: x-large;">{{$store.state.user.username}}</strong>
          <div style="margin-top: 10px">
            <a-badge v-if="$store.state.user.status===0" color="green" status="processing" text="正常"/>
            <a-badge v-if="$store.state.user.status===1" color="red" status="processing" text="封号中" />
          </div>
          <div style="margin-top: 10px">
            <a-badge v-if="$store.state.user.role===0" color="geekblue" status="processing" text="普通用户"/>
            <a-badge v-if="$store.state.user.role===1" color="gold" status="processing" text="管理员" />
          </div>
        </a-space>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col flex="300px">
        <a-card style="margin-top: 20px; width: 300px; border-radius: 15px">
          <a-button block @click="toEditUserInfoPage" type="primary" ghost>编辑个人信息</a-button>
          <a-space direction="vertical" style="margin-top: 20px; text-align: left; width: 270px;">
            <strong style="font-size: medium;">个人简介</strong>
            <span class="profileSpan" :title="$store.state.user.profile">{{$store.state.user.profile}}</span>
            <br/>
            <div>
              <strong class="userInfoTitle">分数</strong>
              <span class="userInfoDetail">{{$store.state.user.rating}}</span>
            </div>
            <div>
              <strong class="userInfoTitle">性别</strong>
              <span class="userInfoDetail" v-if="$store.state.user.gender===0">男</span>
              <span class="userInfoDetail" v-if="$store.state.user.gender===1">女</span>
              <span class="userInfoDetail" v-if="$store.state.user.gender===-1">保密</span>
            </div>
            <div>
              <strong class="userInfoTitle">电话</strong>
              <span class="userInfoDetail" :title="$store.state.user.phone">{{$store.state.user.phone}}</span>
            </div>
            <div>
              <strong class="userInfoTitle">邮箱</strong>
              <span class="userInfoDetail" :title="$store.state.user.email">{{$store.state.user.email}}</span>
            </div>
            <div>
              <strong class="userInfoTitle">加入时间</strong>
              <span class="userInfoDetail">{{$store.state.user.createTime}}</span>
            </div>
          </a-space>
        </a-card>
        <a-card style="margin-top: 10px; width: 300px; border-radius: 15px" title="PK数据">
          <a-row type="flex">
            <a-col :flex="2">
              <a-progress
                  type="circle"
                  :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#5ed927',
                  }"
                  :format="percent => `胜率 ${percent}%`"
                  :percent="winRate"
                  :width="130"
              />
            </a-col>
            <a-col :flex="5" style="margin-left: 15px">
              <div>
                <a-statistic title="PK场数" :value="$store.state.user.pkCount" />
                <a-statistic title="获胜次数" :value="$store.state.user.winCount" style="margin-top: 10px"/>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col flex="auto" style="margin-left: 20px">
        <a-card style="margin-top: 20px; border-radius: 15px">
            <a-button slot="extra" type="primary" style="margin-right: 40px" @click="showAddModal">
              新增BOT
            </a-button>
          <a-table
              :columns="columns"
              :data-source="list"
              :pagination=false
              rowKey="id"
              style="width: 1020px"
          >
            <template slot="id" slot-scope="id" style="text-align: center">
              <a-button type="link" @click="showEditModal(id)" size="small">修改</a-button>
              <a-popconfirm
                  title="确认删除BOT?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteBot(id)"
              >
                <a-button type="link" size="small" style="color: #e30101">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table>
          <br/>
          <a-card style="width: auto">
            <a-pagination
                v-model="page"
                :page-size-options="pageSizeOptions"
                :total="total"
                :show-total="total => `共 ${total} 条`"
                show-size-changer
                :page-size="pageSize"
                @change="pageChange"
                @showSizeChange="onShowSizeChange"
                slot="extra"
            >
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }}条/页</span>
              </template>
            </a-pagination>
          </a-card>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="visible" width="1000px" :title="this.modalTitle+'BOT'" :ok-text="this.modalTitle" :footer="null" @cancel="closeModal">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input placeholder="BOT名称" v-decorator="['title', { initialValue: botInfo.title, rules: [
            { required: true, message: '请输入BOT名称' }], }]"/>
        </a-form-item>
        <a-form-item >
          <a-textarea placeholder="请输入bot简介" v-decorator="['description', { initialValue: botInfo.description, rules: [
            { required: false, message: '请输入BOT简介' }], }]"/>
        </a-form-item>
        <a-form-item >
          <CodeEdit v-model="content"/>
        </a-form-item>
        <a-form-item >
          <a-button type="primary" html-type="submit" style="width: 100%">{{this.modalTitle}}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {addBot, getBotList, removeBot, updateBot} from "@/services/bot";
import CodeEdit from "@/components/bode/code/CodeEdit";

let isFormRight = false // 用于表单验证

const columns = [
  {
    title: 'BOT标题',
    dataIndex: 'title',
    width: '100px',
    align: 'center'
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: '100px',
    align: 'center'
  },
  {
    title: '简介',
    dataIndex: 'description',
    width: '200px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'id', // 操作所需该行的id参数
    scopedSlots: { customRender: 'id' },
    width: '100px',
    align: 'center'
  }
];
export default {
  name: "UserBotIndexView",
  components: {CodeEdit},
  data() {
    return {
      columns, // bot列表的列名
      list: [], // bot列表的数据（就是后端返回的bot列表）
      botInfo: {}, // 新增/修改的表单传入的bot信息
      visible: false, // 模态窗口显示控制
      modalTitle:"", // 模态窗口名称
      form: this.$form.createForm(this, { name: 'editAndAddFrom' }), // 表单
      content:"", //代码块代码
      total: 0, // bot总条数
      page: 1, // bot当前页码
      pageSize: 5, // bot每页显示条数
      pageSizeOptions: ['5', '10'], // bot每页显示条数可以选项
    }
  },
  computed: {
    // 胜率
    winRate() {
      return (Math.round(this.$store.state.user.winCount/this.$store.state.user.pkCount * 10000) / 100.00)
    }
  },
  created() {
    // 初始化数据
    this.fetchData()
  },
  methods: {
    // 获取form表单数据
    getFormData() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 获取表单数据
          this.botInfo.title = values.title
          this.botInfo.description = values.description
          isFormRight = true
        }
        this.botInfo.code = this.content
      });
    },
    // 清除表单数据
    clearFormData() {
      this.form.resetFields()
      this.botInfo = {}
      this.content = "" // 清空代码块
    },
    // 初始化bot数据
    fetchData() {
      getBotList(this.page, this.pageSize).then(res => {
        if (res.code === 20000) {
          this.list = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.description)
          this.$router.push('/')
        }
      }).catch(res => {
        this.$message.error('用户未登录:' + res.message)
        this.$router.push('/')
      })
    },
    // 删除bot
    deleteBot(id) {
      removeBot(id).then(res => {
        if (res.code === 20000) {
          this.$message.success('删除成功')
          this.fetchData() // 刷新数据
        } else {
          this.$message.error(res.description)
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 显示修改bot模态窗口
    showEditModal(id) {
      this.list.forEach((bot) => {
        if (bot.id === id) {
          this.botInfo = bot
          this.content = bot.code
        }
      })
      this.modalTitle = "修改"
      this.visible = true;
    },
    // 显示新增bot模态窗口
    showAddModal() {
      this.content = "// 请编写bot代码(直接在nextMove方法中编写移动逻辑，不要修改代码初始模板)\n" +
          "package com.yang.bode.service.botrunning.utils;\n" +
          "\n" +
          "public class Bot implements com.yang.bode.service.botrunning.utils.BotInterface {\n" +
          "    /**\n" +
          "     * @param input 操作所需参数\n" +
          "     * @return 移动的方向：0-上 1-右 2-下 3-左\n" +
          "     */\n" +
          "    @Override\n" +
          "    public Integer nextMove(String input) {\n" +
          "      return 0;\n" +
          "    }\n" +
          "}"
      this.modalTitle = "新增"
      this.visible = true;
    },
    // 新增或修改bot（提交表单）
    handleSubmit() {
      this.getFormData() // 获取表单数据
      if (!isFormRight) { // 如果表单有require数据未填
        return
      }
      // 如果是新增bot
      if (this.modalTitle === '新增') {
        addBot(this.botInfo).then(res => {
          if (res.code === 20000) {
            this.$message.success('新增成功')
            this.fetchData() // 刷新数据
            this.visible = false;
          } else {
            this.$message.error(res.description)
          }
        }).catch(res => {
          this.$message.error(res.message)
        })
        // 清空bot表单信息
        this.botInfo = {}
      }
      // 如果是修改bot
      if (this.modalTitle === '修改') {
        updateBot(this.botInfo).then(res => {
          if (res.code === 20000) {
            this.$message.success('修改成功')
            this.fetchData() // 刷新数据
            this.visible = false;
          } else {
            this.$message.error(res.description)
          }
        }).catch(res => {
          this.$message.error(res.message)
        })
      }
      // 清空表单的bot信息
      this.clearFormData()
    },
    // 关闭模态窗口
    closeModal() {
      // 清空表单的bot信息
      this.clearFormData()
    },
    // 每页显示条数变化（这个page变化页数底层用得到）
    onShowSizeChange(page, pageSize) {
      this.page = 1 // 回到第一页
      this.pageSize = pageSize
      this.fetchData() // 查询数据
    },
    // 页码改变
    pageChange(page) {
      this.page = page
      this.fetchData()
    },
    // 路由跳转到编辑个人信息界面
    toEditUserInfoPage() {
      this.$router.push('/user/edit')
    }
  }
}
</script>

<style scoped>
.userInfoTitle {
  font-size: medium;
  margin-right: 17px
}
.userInfoDetail {
  font-size: medium;
  white-space: pre-line;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 150px;
  display: inline-block;
  vertical-align: top
}
.profileSpan{
  font-size: small;
  color: #93939b;
  white-space: pre-line;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 270px;
  display: inline-block;
  vertical-align: top
}
</style>
