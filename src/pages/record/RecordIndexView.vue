<template>
  <a-card style="margin-top: 20px; border-radius: 15px">
    <a-table
        :columns="columns"
        :data-source="list"
        :pagination=false
        rowKey="id"
        style="width: auto"
    >
      <span slot="userA" slot-scope="userA">
        <a-popover placement="bottom">
            <template slot="content">
              <p>
                用户名：{{userA.username}}
              </p>
              <p>分数：{{userA.rating}}</p>
              <p>胜场：{{userA.winCount}}</p>
              <span>对局总数：{{userA.pkCount}}</span>
            </template>
            <a-avatar :src="userA.avatar" size="large"/>
          </a-popover>
      </span>
      <span slot="userB" slot-scope="userB">
        <a-popover placement="bottom">
            <template slot="content">
              <p>
                用户名：{{userB.username}}
              </p>
              <p>分数：{{userB.rating}}</p>
              <p>胜场：{{userB.winCount}}</p>
              <span>对局总数：{{userB.pkCount}}</span>
            </template>
            <a-avatar :src="userB.avatar" size="large"/>
          </a-popover>
      </span>
      <span slot="loser" slot-scope="loser" >
        <a-tag v-if="loser === 'all'" color="#87d068">
          平 局
        </a-tag>
        <a-tag v-if="loser === 'B'" color="#9a5db0">
          A 赢
        </a-tag>
        <a-tag v-if="loser === 'A'" color="#F94848">
          B 赢
        </a-tag>
      </span>
      <template slot="id" slot-scope="id" style="text-align: center">
        <a-button type="link" @click="toRecordContentPage(id)" size="large">查看录像</a-button>
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
</template>

<script>
import {getRecordList} from '@/services/record'
import {mapMutations} from "vuex";

const columns = [
  {
    title: '用户A',
    dataIndex: 'userA',
    scopedSlots: { customRender: 'userA' },
    width: '100px',
    align: 'center'
  },
  {
    title: '用户B',
    dataIndex: 'userB',
    scopedSlots: { customRender: 'userB' },
    width: '100px',
    align: 'center'
  },
  {
    title: '对战结果',
    dataIndex: 'loser',
    scopedSlots: { customRender: 'loser' },
    width: '100px',
    align: 'center'
  },
  {
    title: '对战日期',
    dataIndex: 'createTime',
    width: '100px',
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
  name: "RecordIndexView",
  data() {
    return {
      columns, // 对局列表的列名
      list: [], // 对局列表的数据
      total: 0,
      page: 1, // 对局当前页码
      pageSize: 10, // 对局每页显示条数
      pageSizeOptions: ['10', '20'], // 对局每页显示条数可以选项
    }
  },
  mounted() {
    // 刷新页面（和使用浏览器刷新一样，每次只执行一次），目的是重置对局数据，不这样刷新的话当用户看录像时刷新退出后再次访问地图等信息无法生效
    // TODO 但是这样数据加载就显得有点慢，待优化（思路：可不可以在查看录像回放时禁止刷新？）
    if (window.location.href.indexOf("#reloaded") === -1) {
      window.location.href = window.location.href + "#reloaded";
      window.location.reload();
    }
    this.fetchData()
  },
  methods: {
    ...mapMutations('record', ['updateAllUser', 'updateIsRecord', 'updateSteps', 'updateRecordLoser']),
    ...mapMutations('pk', ['updateGame']),

    // 将map转为二维数组
    stringTo2D(map) {
      let gameMap = [];
      for (let i = 0, k = 0; i < 13; i ++ ) {
        let line = [];
        for (let j = 0; j < 14; j ++, k ++ ) {
          if (map[k] === '0') {
            line.push(0);
          }
          else {
            line.push(1);
          }
        }
        gameMap.push(line);
      }
      return gameMap;
    },
    // 跳转到查看录像界面
    toRecordContentPage(id) {
      this.list.forEach(record => {
        if (record.id === id) {
          this.updateIsRecord(true)
          this.updateAllUser({
            userA: record.userA,
            userB: record.userB
          })
          this.updateGame({
            map: this.stringTo2D(record.map),
            a_id: record.aid,
            a_sx: record.asx,
            a_sy: record.asy,
            b_id: record.bid,
            b_sx: record.bsx,
            b_sy: record.bsy,
          })
          this.updateSteps({
            a_steps: record.asteps,
            b_steps: record.bsteps,
          })
          this.updateRecordLoser(record.loser)
          // 路由跳转
          this.$router.push(`/view/${id}`)
        }
      })
    },
    // 初始化对局数据
    fetchData() {
      getRecordList(this.page, this.pageSize).then(res => {
        if (res.code === 20000) {
          this.list = res.data.recordList
          this.total = res.data.total
        } else {
          this.$message.error(res.description)
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
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
