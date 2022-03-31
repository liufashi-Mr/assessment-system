import request from "@/utils/request";

export function getUniverse(data) {
  return request({
    url: "/universe/getUniverse",
    method: "post",
    data,
  });
}
export function addUniverse(data) {
  return request({
    url: "/universe/addUniverse",
    method: "post",
    data,
  });
}
export function getStudent(data) {
  return request({
    url: "/student/getStudent",
    method: "post",
    data,
  });
}
export function addStudent(data) {
  return request({
    url: "/student/addStudent",
    method: "post",
    data,
  });
}
export function addGrade(data) {
  return request({
    url: "/student/addGrade",
    method: "post",
    data,
  });
}
export function getGrade(data) {
  return request({
    url: "/student/getGrade",
    method: "post",
    data,
  });
}
export function updateStudent(data) {
  return request({
    url: "/student/updateStudent",
    method: "post",
    data,
  });
}
