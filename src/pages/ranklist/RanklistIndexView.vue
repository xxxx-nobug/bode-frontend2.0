<template>
  <a-card style="margin-top: 20px; border-radius: 15px">
    <a-table
        :columns="columns"
        :data-source="list"
        :pagination=false
        rowKey="id"
        style="width: auto"
    >
      <span slot="username" slot-scope="username, record">
        <a-button type="link" @click="toUserInfoPage(record.id)">{{username}}</a-button>
      </span>

      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" size="large"/>
      </span>
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
</template>

<script>
import {getUserRankList} from "@/services/user";

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    scopedSlots: { customRender: 'username' },
    width: '100px',
    align: 'center'
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    scopedSlots: { customRender: 'avatar' },
    width: '100px',
    align: 'center'
  },
  {
    title: '胜场',
    dataIndex: 'winCount',
    width: '100px',
    align: 'center'
  },
  {
    title: '对战次数',
    dataIndex: 'pkCount',
    width: '100px',
    align: 'center'
  },
  {
    title: '分数',
    dataIndex: 'rating',
    width: '100px',
    align: 'center'
  },
  {
    title: '简介',
    dataIndex: 'profile',
    width: '200px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '加入日期',
    dataIndex: 'createTime',
    width: '100px',
    align: 'center'
  },
]
export default {
  name: "RanklistIndexView",
  data() {
    return {
      columns,
      list: [], // 排行榜的数据
      total: 0,
      page: 1, // 对局当前页码
      pageSize: 10, // 对局每页显示条数
      pageSizeOptions: ['10', '20'], // 对局每页显示条数可以选项
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 初始化对局数据
    fetchData() {
      getUserRankList(this.page, this.pageSize).then(res => {
        if (res.code === 20000) {
          this.list = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.description)
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    toUserInfoPage(id) {
      // TODO 跳转到用户信息界面
      this.$router.push(`/user/info/${id}`)
      console.log(id)
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
  }
}
</script>

<style scoped>

</style>
