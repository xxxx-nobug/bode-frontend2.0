import myAxios from "@/utils/myAxios";
import userStore from "@/store/modules/user";

const BaseUrl = '/service/basic'

/**
 * 登录服务
 * @param username 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(username, password) {
    return myAxios.post(`${BaseUrl}/user/account/token`, {
        username: username, // 账号
        password: password // 密码
    })
}

/**
 * 注册
 * @param username 账户名
 * @param password 账户密码
 * @param verifyPassword 确认密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function register(username, password, verifyPassword) {
    return myAxios.post(`${BaseUrl}/user/account/register`, {
        username: username, // 账号
        password: password, // 密码
        verifyPassword: verifyPassword // 确认密码
    })
}

/**
 * 获取登录用户信息
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getInfo() {
    return myAxios.get(`${BaseUrl}/user/account/info`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 获取user Rank列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getUserRankList(page, pageSize) {
    return myAxios.get(`${BaseUrl}/user/rank/list/${page}/${pageSize}`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 获取user信息
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getUserInfoById(id) {
    return myAxios.get(`${BaseUrl}/user/info/${id}`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 退出登录（退出登录必须携带token，因为要通过token获取到用户id从而删除redis中数据）
 */
export function logout() {
    myAxios.get(`${BaseUrl}/user/account/logout`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    }).then(res => {
        if (res.code === 20000) {
            localStorage.removeItem('jwt_token')
            userStore.mutations.logout(userStore.state)
        }
    }).catch(res => {
        console.log('logout error message:' + res)
    })
}

/**
 * 更新当前登录用户信息
 * @param userInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function updateMyInfo(userInfo) {
    return myAxios.post(`${BaseUrl}/user/my/update`, {
        id: userInfo.id,
        username: userInfo.username,
        phone: userInfo.phone,
        email: userInfo.email,
        gender: userInfo.gender,
        profile: userInfo.profile,
        avatar: userInfo.avatar
    }, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

export default {
    login,
    register,
    getUserRankList,
    getUserInfoById,
    getInfo,
    logout,
}
