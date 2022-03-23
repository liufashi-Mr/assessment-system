import Vue from "vue";
import Router from "vue-router";
import { getToken } from "@/utils/auth";
Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import componentsRouter from "./modules/components";
// import chartsRouter from "./modules/charts";
// import tableRouter from "./modules/table";
// import nestedRouter from "./modules/nested";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: "/redirect",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "/redirect/:path(.*)",
  //       component: () => import("@/views/redirect/index"),
  //     },
  //   ],
  // },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
  },
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/home/index"),
        name: "Home",
        meta: { title: "首页", icon: "el-icon-s-home", affix: true },
      },
    ],
  },
  {
    path: "/userManage",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/userManage/index"),
        name: "userManage",
        meta: {
          title: "用户管理",
          icon: "user",
          noCache: true,
          roles: ["admin"],
        },
      },
    ],
  },
  {
    path: "/rewardsDeclare",
    // redirect:"/rewardsDeclare/declareList",
    component: Layout,
    alwaysShow: true,
    meta: { title: "评奖系统", icon: "el-icon-medal", noCache: true },
    children: [
      {
        path: "rewardApply",
        component: () => import("@/views/rewardsDeclare/rewardApply"),
        name: "RewardApply",
        meta: {
          title: "奖励申请",
          icon: "education",
          noCache: true,
          roles: ["student", "admin"],
        },
      },
      {
        path: "rewardList",
        component: () => import("@/views/rewardsDeclare/rewardList"),
        name: "RewardList",
        meta: {
          title: "奖励概览",
          icon: "education",
          noCache: true,
          roles: [
            "student",
            "admin",
            "office",
            "teacher",
            "college",
            "xuegongchu",
            "xiaofenguan",
          ],
        },
      },
      {
        path: "declareList",
        component: () => import("@/views/rewardsDeclare/declareList"),
        name: "DeclareList",
        meta: {
          title: "申请列表",
          icon: "list",
          noCache: true,
          roles: [
            "student",
            "admin",
            "office",
            "teacher",
            "college",
            "xuegongchu",
            "xiaofenguan",
          ],
        },
      },
    ],
  },
  {
    path: "/assessmentManage",
    component: Layout,
    meta: { title: "评优系统", icon: "el-icon-trophy", noCache: true },
    children: [
      {
        path: "assessmentApply",
        component: () => import("@/views/assessmentManage/assessmentApply"),
        name: "assessmentApply",
        meta: {
          title: "评优申请",
          icon: "education",
          noCache: true,
          roles: ["student", "admin"],
        },
      },
      {
        path: "rewardList",
        component: () => import("@/views/assessmentManage/rewardList"),
        name: "RewardList",
        meta: {
          title: "评优概览",
          icon: "education",
          noCache: true,
          roles: [
            "student",
            "admin",
            "office",
            "teacher",
            "college",
            "xuegongchu",
            "xiaofenguan",
          ],
        },
      },
      {
        path: "declareList",
        component: () => import("@/views/assessmentManage/declareList"),
        name: "DeclareList",
        meta: {
          title: "申请列表",
          icon: "list",
          noCache: true,
          roles: [
            "student",
            "admin",
            "office",
            "teacher",
            "college",
            "xuegongchu",
            "xiaofenguan",
          ],
        },
      },
    ],
  },
  {
    path: "/processManage",
    component: Layout,
    meta: { title: "流程管理", icon: "el-icon-set-up", noCache: true },
    children: [
      {
        path: "rewardsProcess",
        component: () => import("@/views/processManage/rewardsProcess"),
        name: "RewardsProcess",
        meta: {
          title: "奖励审核流程",
          icon: "el-icon-setting",
          noCache: true,
          roles: ["admin", "office"],
        },
      },
      {
        path: "assessmentProcess",
        component: () => import("@/views/processManage/assessmentProcess"),
        name: "AssessmentProcess",
        meta: {
          title: "评优审核流程",
          icon: "el-icon-setting",
          noCache: true,
          roles: ["admin", "office"],
        },
      },
      {
        path: "total",
        component: () => import("@/views/processManage/total"),
        name: "Total",
        meta: {
          title: "汇总统计",
          icon: "el-icon-s-data",
          noCache: true,
          roles: ["admin"],
        },
      },
      {
        path: "informationInout",
        component: () => import("@/views/processManage/informationInout"),
        name: "InformationInout",
        meta: {
          title: "信息导入导出",
          icon: "excel",
          noCache: true,
          roles: ["admin"],
        },
      },
    ],
  },
  {
    path: "/myCheck",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/myCheck/index"),
        name: "MyCheck",
        meta: {
          title: "我的审核",
          icon: "tree-table",
          noCache: true,
          roles: [
            "admin",
            "office",
            "teacher",
            "college",
            "xuegongchu",
            "xiaofenguan",
          ],
        },
      },
    ],
  },
  {
    path: "/apply",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/apply/index"),
        name: "Apply",
        meta: {
          title: "评奖评优发布",
          icon: "guide",
          noCache: true,
          roles: ["office"],
        },
      },
    ],
  },
  {
    path: "/icon",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/icons/index"),
        name: "Icons",
        meta: {
          title: "Icons",
          icon: "icon",
          noCache: true,
          roles: [
            "student",
            "admin",
            "office",
            "teacher",
            "college",
            "xuegongchu",
            "xiaofenguan",
          ],
        },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
