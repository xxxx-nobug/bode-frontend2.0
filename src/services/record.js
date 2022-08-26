import myAxios from "@/utils/myAxios";
import userStore from "@/store/modules/user";

const baseUrl = '/service/basic'

/**
 * 获取record列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getRecordList(page, pageSize) {
    return myAxios.get(`${baseUrl}/record/list/${page}/${pageSize}`, {
        headers: {
            Authorization: "Bearer " + userStore.state.token,
        }
    })
}

export default {
    getRecordList
}
