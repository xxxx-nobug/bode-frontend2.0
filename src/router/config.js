import TabsView from '@/layouts/tabs/TabsView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register/Register'),
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/pk',
      children: [
        {
          path: '/pk',
          name: '对战',
          meta: {
          },
          component: () => import('@/pages/pk/PkIndexView')
        },
        {
          path: '/record',
          name: '对局列表',
          meta: {
          },
          component: () => import('@/pages/record/RecordIndexView'),
        },
        {
          path: '/view/:recordId',
          name: '对局回放',
          meta: {
            invisible: true // 不在菜单上显示
          },
          component: () => import('@/pages/record/RecordContentView'),
        },
        {
          path: '/ranklist',
          name: '排行榜',
          meta: {
          },
          component: () => import('@/pages/ranklist/RanklistIndexView'),
        },
        {
          path: '/user/info/:id',
          name: '用户信息',
          meta: {
            invisible: true // 不在菜单上显示
          },
          component: () => import('@/pages/ranklist/UserBotInfoView'),
        },
        {
          path: '/user/bot',
          name: '我的bot',
          meta: {
            invisible: true // 不在菜单上显示
          },
          component: () => import('@/pages/user/bot/UserBotIndexView'),
        },
        {
          path: '/user/edit',
          name: '编辑个人信息',
          meta: {
            invisible: true // 不在菜单上显示
          },
          component: () => import('@/pages/user/EditUserInfoView'),
        },
      ]
    }
  ]
}

export default options
