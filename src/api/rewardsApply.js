import request from '@/utils/request'

export function getRewardsApplyList(params) {
  return request({
    url: '/vue-element-admin/rewards/apply/list', // 假地址 自行替换
    method: 'get',
    params: {
      name: params.name,
      page: params.currentPage
    }
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
