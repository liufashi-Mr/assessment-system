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
    console.log(getToken() === "admin")
    this.currentRole =
      getToken() === "admin" ? "adminDashboard" : "editorDashboard";
  },
};
</script>
