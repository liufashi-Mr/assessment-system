<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Home',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  created() {
    this.currentRole=getToken()
  },
  created() {
    if (!this.currentRole!=='admin') {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
