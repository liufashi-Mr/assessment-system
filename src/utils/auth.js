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

export function setInfo(token) {
  return Cookies.set("userInfo", token)
}

