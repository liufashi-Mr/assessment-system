<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import adminDashboard from "./admin";
import editorDashboard from "./editor";

export default {
  name: "Home",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
    };
  },
  created() {
    // 根据登录时存的cookie区分角色,显示不同的首页
    // admin 管理员首页
    // editor 其他角色首页
    console.log(getToken() === "admin")
    this.currentRole =
      getToken() === "admin" ? "adminDashboard" : "editorDashboard";
  },
};
</script>
