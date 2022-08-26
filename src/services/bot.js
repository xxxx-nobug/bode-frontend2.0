import myAxios from "@/utils/myAxios";
import userStore from "@/store/modules/user";

const BaseUrl = '/service/basic'

/**
 * 获取bot列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getBotList(page, pageSize) {
    return myAxios.get(`${BaseUrl}/user/bot/list/${page}/${pageSize}`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 新增bot
 * @param botInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function addBot(botInfo) {
    return myAxios.post(`${BaseUrl}/user/bot/add`, {
        title: botInfo.title,
        description: botInfo.description,
        code: botInfo.code,
    }, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 修改bot
 * @param botInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function updateBot(botInfo) {
    return myAxios.post(`${BaseUrl}/user/bot/update`, {
        id: botInfo.id,
        title: botInfo.title,
        description: botInfo.description,
        code: botInfo.code,
    }, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 删除bot
 * @param botId
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function removeBot(botId) {
    return myAxios.post(`${BaseUrl}/user/bot/remove/${botId}`, null, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

/**
 * 通过用户id获取bot列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getBotListByUserId(page, pageSize, userId) {
    return myAxios.get(`${BaseUrl}/user/bot/botlist/${page}/${pageSize}/${userId}`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

export default {
    getBotList,
    addBot,
    updateBot,
    removeBot,
    getBotListByUserId
}
