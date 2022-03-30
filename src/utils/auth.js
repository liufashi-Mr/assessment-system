import Cookies from 'js-cookie'

const TokenKey = 'Assessment-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getInfo() {
  return Cookies.get("userInfo")
}
export function setInfo(v) {
  return Cookies.set("userInfo",v)
}
export function removeInfo(token) {
  return Cookies.remove("userInfo")
}

