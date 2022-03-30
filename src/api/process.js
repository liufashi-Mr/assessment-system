import request from "@/utils/request";

export function createProcess(data) {
  return request({
    url: "/process/createProcess",
    method: "post",
    data,
  });
}
export function getProcess(data) {
  return request({
    url: "/process/getProcess",
    method: "post",
    data,
  });
}
