import request from "@/utils/request";

export function getRewards(data) {
  return request({
    url: "/activity/getRewards", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function addReward(data) {
  return request({
    url: "/activity/addReward", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function updateReward(data) {
  return request({
    url: "/activity/updateReward", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function removeReward(data) {
  return request({
    url: "/activity/removeReward", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function getRewardDetail(data) {
  return request({
    url: "/activity/getRewardDetail", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function applyReward(data) {
  return request({
    url: "/activity/applyReward", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function updateApply(data) {
  return request({
    url: "/activity/updateApply", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function cancelApply(data) {
  return request({
    url: "/activity/cancelApply", // 假地址 自行替换
    method: "post",
    data,
  });
}

export function getApplyList(data) {
  return request({
    url: "/activity/getApplyList", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function confirmApply(data) {
  return request({
    url: "/activity/confirmApply", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function getStudentDetail(data) {
  return request({
    url: "/activity/getStudentDetail", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function getApplyDetail(data) {
  return request({
    url: "/activity/getApplyDetail", // 假地址 自行替换
    method: "post",
    data,
  });
}
export function getProcessDetail(data) {
  return request({
    url: "/activity/getProcessDetail",
    method: "post",
    data,
  });
}