export default {
    namespaced: true,
    state: {
        status: "matching",  // matching表示匹配界面，playing表示对战界面
        socket: null,
        opponentUsername: "", // 对手用户名
        opponentAvatar: "", // 对手头像
        opponentWinCount: "", // 胜利次数
        opponentPkCount: "", // PK总次数
        opponentRating: "", // 分数
        gameMap: null,
        a_id: 0, // 左下角蛇的操作用户id
        a_sx: 0,
        a_sy: 0,
        b_id: 0, // 右上角蛇的操作用户id
        b_sx: 0,
        b_sy: 0,
        gameObject: null,
        loser: "none",  // none、all、A、B

    },
    getters: {
    },
    mutations: {
        updateSocket(state, socket) {
            state.socket = socket
        },
        updateOpponent(state, opponent) {
            state.opponentUsername = opponent.username
            state.opponentAvatar = opponent.avatar
            state.opponentWinCount= opponent.winCount
            state.opponentPkCount = opponent.pkCount
            state.opponentRating = opponent.rating
        },
        updateStatus(state, status) {
            state.status = status
        },
        updateGame(state, game) {
            state.gameMap = game.map
            state.a_id = game.a_id
            state.a_sx = game.a_sx
            state.a_sy = game.a_sy
            state.b_id = game.b_id
            state.b_sx = game.b_sx
            state.b_sy = game.b_sy
        },
        updateGameObject(state, gameObject) {
            state.gameObject = gameObject
        },
        updateLoser(state, loser) {
            state.loser = loser
        }
    },
    actions: {
    },
    modules: {
    }
}
