import request from '@/utils/request'

export function getRewards(data) {
  return request({
    url: '/activity/getRewards', // 假地址 自行替换
    method: 'post',
    data
  })
}
export function getRewardsRewordList(params) {
  return request({
    url: '/vue-element-admin/rewards/reward/list', // 假地址 自行替换
    method: 'get',
    params: {
      name: params.name,
      page: params.currentPage
    }
  })
}