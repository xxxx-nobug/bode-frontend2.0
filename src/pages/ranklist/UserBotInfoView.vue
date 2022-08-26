<template>
  <div>
    <a-row type="flex">
      <a-col flex="100px">
        <a-avatar :size="120" shape="square" :src="userInfo.avatar" style="border-radius: 15px"/>
      </a-col>
      <a-col flex="700px" style="margin-left: 25px; text-align: left">
        <a-space direction="vertical">
          <strong style="font-size: x-large;">{{userInfo.username}}</strong>
          <div style="margin-top: 10px">
            <a-badge v-if="userInfo.status===0" color="green" status="processing" text="正常"/>
            <a-badge v-if="userInfo.status===1" color="red" status="processing" text="封号中" />
          </div>
          <div style="margin-top: 10px">
            <a-badge v-if="userInfo.role===0" color="geekblue" status="processing" text="普通用户"/>
            <a-badge v-if="userInfo.role===1" color="gold" status="processing" text="管理员" />
          </div>
        </a-space>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col flex="300px">
        <a-card style="margin-top: 20px; width: 300px; border-radius: 15px">
          <a-space direction="vertical" style="text-align: left; width: 270px;">
            <strong style="font-size: medium;">个人简介</strong>
            <span class="profileSpan" :title="userInfo.profile">{{userInfo.profile}}</span>
            <br/>
            <div>
              <strong class="userInfoTitle">分数</strong>
              <span class="userInfoDetail">{{userInfo.rating}}</span>
            </div>
            <div>
              <strong class="userInfoTitle">性别</strong>
              <span class="userInfoDetail" v-if="userInfo.gender===0">男</span>
              <span class="userInfoDetail" v-if="userInfo.gender===1">女</span>
              <span class="userInfoDetail" v-if="userInfo.gender===-1">保密</span>
            </div>
            <div>
              <strong class="userInfoTitle">电话</strong>
              <span class="userInfoDetail" :title="userInfo.phone">{{userInfo.phone}}</span>
            </div>
            <div>
              <strong class="userInfoTitle">邮箱</strong>
              <span class="userInfoDetail" :title="userInfo.email">{{userInfo.email}}</span>
            </div>
            <div>
              <strong class="userInfoTitle">加入时间</strong>
              <span class="userInfoDetail">{{userInfo.createTime}}</span>
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
                <a-statistic title="PK场数" :value="userInfo.pkCount" />
                <a-statistic title="获胜次数" :value="userInfo.winCount" style="margin-top: 10px"/>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col flex="auto" style="margin-left: 20px">
        <a-card style="margin-top: 20px; border-radius: 15px">
          <a-table
              :columns="columns"
              :data-source="list"
              :pagination=false
              rowKey="id"
              style="width: 1020px"
          >
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
  </div>
</template>

<script>
import {getUserInfoById} from "@/services/user";
import {getBotListByUserId} from "@/services/bot";

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
];
export default {
  name: "UserBotInfoView",
  data() {
    return {
      userInfo: {},
      columns, // bot列表的列名
      list: [], // bot列表的数据（就是后端返回的bot列表）
      total: 0, // bot总条数
      page: 1, // bot当前页码
      pageSize: 5, // bot每页显示条数
      pageSizeOptions: ['5', '10'], // bot每页显示条数可以选项
    }
  },
  computed: {
    // 胜率
    winRate() {
      return (Math.round(this.userInfo.winCount/this.userInfo.pkCount * 10000) / 100.00)
    }
  },
  mounted() {
    // this.userInfo = this.$route.params.id
    // console.log(this.$route.params.id)
    this.getUserInfo()
    this.getBotInfo()
  },
  methods: {
    // 发送获取用户信息和bot的请求
    getUserInfo() {
      getUserInfoById(this.$route.params.id).then(res => {
        if (res.code === 20000) {
          this.userInfo = res.data
        } else {
          this.$message.error(res.description)
        }
      }).catch(res => {
        this.$message.error(res.description)
      })
    },
    getBotInfo() {
      // 获取用户bot
      getBotListByUserId(this.page, this.pageSize, this.$route.params.id).then(res => {
        if (res.code === 20000) {
          this.list = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.description)
        }
      }).catch(res => {
        this.$message.error(res.description)
      })
    },
    // 每页显示条数变化（这个page变化页数底层用得到）
    onShowSizeChange(page, pageSize) {
      this.page = 1 // 回到第一页
      this.pageSize = pageSize
      this.getBotInfo() // 查询数据
    },
    // 页码改变
    pageChange(page) {
      this.page = page
      this.getBotInfo()
    },
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
