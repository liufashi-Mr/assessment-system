import { login, logout } from "@/api/user";
import { getToken, setToken, removeToken, setInfo,getInfo, removeInfo } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import { remove } from "nprogress";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    console.log(roles, "role");
    state.roles = roles;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, role } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password, role })
        .then((response) => {
          const { data } = response;
          console.log(data);
          commit("SET_TOKEN", data[0].role);
          commit("SET_NAME", data[0].username);
          commit("SET_AVATAR", data[0].avatar||require('@/assets/avatar.jpg'));
          setToken(data[0].role);
          if (data[0].role === "student") {

            setInfo(JSON.stringify({
              studentName: data[0].studentName,
              studentNumber: data[0].studentNumber,
              studentId:data[0].id
            }));
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit("SET_TOKEN", "");
    commit("SET_ROLES", []);
    removeToken();
    removeInfo()
    resetRouter();
    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch("tagsView/delAllViews", null, { root: true });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true,
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
