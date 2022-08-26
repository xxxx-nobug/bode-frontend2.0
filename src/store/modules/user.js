export default {
    namespaced: true,
    state: {
        id: "",
        username: "",
        avatar: "",
        gender: "",
        phone: "",
        email: "",
        status: "",
        role: "",
        pkCount: "",
        winCount: "",
        rating: "",
        profile: "",
        createTime: "",
        updateTime: "",
        token: "",
        is_login: false,
        pulling_info: true,  // 是否正在从云端拉取信息
    },
    getters: {
    },
    mutations: {
        setUser(state, user) {
            state.id = user.id
            state.username = user.username
            state.avatar = user.avatar
            state.gender = user.gender
            state.phone = user.phone
            state.email = user.email
            state.status = user.status
            state.role = user.role
            state.pkCount = user.pkCount
            state.winCount = user.winCount
            state.rating = user.rating
            state.profile = user.profile
            state.createTime = user.createTime
            state.updateTime = user.updateTime
            state.is_login = user.is_login
        },
        setToken(state, token) {
            state.token = token
            localStorage.setItem('jwt_token', token)
        },
        logout(state) {
            state.id = ""
            state.username = ""
            state.avatar = ""
            state.gender = ""
            state.phone = ""
            state.email = ""
            state.status = ""
            state.role = ""
            state.pkCount = ""
            state.winCount = ""
            state.rating = ""
            state.profile = ""
            state.createTime = ""
            state.updateTime = ""
            state.token = ""
            state.is_login = false
        },
        setPullingInfo(state, pulling_info) {
            state.pulling_info = pulling_info
        }
    },
    modules: {
    }
}
