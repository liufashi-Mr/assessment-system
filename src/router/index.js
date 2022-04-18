import Vue from "vue";
import Router from "vue-router";
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
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/personalInfo",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/personalInfo/index"),
        name: "allCheck",
        meta: {
          title: "个人信息",
          icon: "user",
          noCache: true,
          roles: ["student"],
        },
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
    redirect: "/rewardsDeclare/rewardList",
    component: Layout,
    alwaysShow: true,
    meta: { title: "评优评奖系统", icon: "el-icon-medal", noCache: true },
    children: [
      {
        path: "rewardList",
        component: () => import("@/views/rewardsDeclare/rewardList"),
        name: "RewardList",
        meta: {
          title: "概览",
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
        path: "applyList",
        component: () => import("@/views/rewardsDeclare/applyList"),
        name: "ApplyList",
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
  // {
  //   path: "/assessmentManage",
  //   component: Layout,
  //   meta: { title: "评优系统", icon: "el-icon-trophy", noCache: true },
  //   children: [
  //     {
  //       path: "assessmentList",
  //       component: () => import("@/views/assessmentManage/assessmentList"),
  //       name: "AssessmentList",
  //       meta: {
  //         title: "评优概览",
  //         icon: "education",
  //         noCache: true,
  //         roles: [
  //           "student",
  //           "admin",
  //           "office",
  //           "teacher",
  //           "college",
  //           "xuegongchu",
  //           "xiaofenguan",
  //         ],
  //       },
  //     },
  //     {
  //       path: "applyList",
  //       component: () => import("@/views/assessmentManage/applyList"),
  //       name: "ApplyList_",
  //       meta: {
  //         title: "申请列表",
  //         icon: "list",
  //         noCache: true,
  //         roles: [
  //           "student",
  //           "admin",
  //           "office",
  //           "teacher",
  //           "college",
  //           "xuegongchu",
  //           "xiaofenguan",
  //         ],
  //       },
  //     },
  //   ],
  // },
  {
    path: "/processManage",
    redirect: "/processManage/process",
    component: Layout,
    meta: {
      title: "流程管理",
      icon: "el-icon-set-up",
      noCache: true,
      roles: ["admin", "office"],
    },
    children: [
      {
        path: "process",
        component: () => import("@/views/processManage/process"),
        name: "Process",
        meta: {
          title: "审核流程",
          icon: "el-icon-setting",
          noCache: true,
          roles: ["admin", "office"],
        },
      },
      // {
      //   path: "total",
      //   component: () => import("@/views/processManage/total"),
      //   name: "Total",
      //   meta: {
      //     title: "汇总统计",
      //     icon: "el-icon-s-data",
      //     noCache: true,
      //     roles: ["admin","office"],
      //   },
      // },
      // {
      //   path: "informationInout",
      //   component: () => import("@/views/processManage/informationInout"),
      //   name: "InformationInout",
      //   meta: {
      //     title: "信息导入导出",
      //     icon: "excel",
      //     noCache: true,
      //     roles: ["admin","office"],
      //   },
      // },
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
          roles: ["teacher", "college", "xuegongchu", "xiaofenguan"],
        },
      },
    ],
  },
  {
    path: "/allCheck",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/allCheck/index"),
        name: "allCheck",
        meta: {
          title: "所有审核",
          icon: "tree-table",
          noCache: true,
          roles: ["admin", "office"],
        },
      },
    ],
  },
  {
    path: "/myApply",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/myApply/index"),
        name: "myApply",
        meta: {
          title: "我的申请",
          icon: "tree-table",
          noCache: true,
          roles: ["student"],
        },
      },
    ],
  },
  {
    path: "/result",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/processManage/total"),
        name: "Result",
        meta: {
          title: "结果公布与导出",
          icon: "guide",
          noCache: true,
          roles: ["admin", "office"],
        },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

router.addRoutes([...asyncRoutes]);
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
