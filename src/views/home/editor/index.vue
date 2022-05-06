<template>
  <div style="margin: 10px" class="home">
    <el-card shadow="hover" class="box-card" style="min-height: 210px">
      <el-col :lg="{ span: 4 }">
        <img class="avatar" :src="avatar" alt="" />
      </el-col>
      <el-col :lg="{ span: 8 }" style="font-size: 13px">
        <p>欢迎登录，以下是您的账号信息</p>
        <p>用户名：{{ name }}</p>
        　
        <p>用户角色：{{ roleName }}</p>
        　
        <p v-if="roleName === '学生'">
          系统功能：申请奖项、修改个人信息、查看申请信息
        </p>
        <p v-else-if="roleName === '教务处'">
          系统功能：奖项查阅、查看步骤、管理奖项审核流程、导出评选结果
        </p>
        <p v-else>系统功能：奖项审核、查看步骤</p>
      </el-col>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import getRoleName from "@/utils/getRoleName";
import { getToken } from "@/utils/auth";
import LineChart from "../admin/components/LineChart.vue";
import PieChart from "../admin/components/PieChart.vue";
import TransactionTable from "../admin/components/TransactionTable.vue";
import { getRewards, getApplyList, getRewardResult } from "@/api/rewards";
import user from "@/store/modules/user";
import { getStudent } from "@/api/manage";
import CountTo from "vue-count-to";
export default {
  data() {
    return {
      roleName: "",
      messageCount: null,
      nums: [],
      chartData: null,
      rewardsData: null,
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"]),
  },
  components: {
    LineChart,
    PieChart,
    TransactionTable,
    CountTo,
  },
  async mounted() {
    this.roleName = getRoleName(getToken());
    await this.getStudentList();
    await this.getRewardsList();
    await this.getMessageCount();
    await this.promiseRewardId();
  },
  methods: {
    async getStudentList() {
      let data = {
        collegeId: "",
        grade: "",
        majorId: "",
        studentName: "",
        studentNumber: "",
        typeId: "",
      };
      const { total } = await getStudent(data);
      const total_user = {
        name: "用户个数",
        value: total,
        icon: require("@/assets/home/user.png"),
        link: "userManage/index",
      };
      this.nums.push(total_user);
    },
    async getRewardsList() {
      const { data, total } = await getRewards();
      const total_reward = {
        name: "奖项个数",
        value: total,
        icon: require("@/assets/home/graph-bar.png"),
        link: "rewardsDeclare/rewardList",
      };
      this.rewardsData = data;
      this.nums.push(total_reward);
    },
    async getMessageCount() {
      const { data } = await getApplyList({ role: getToken() });
      const total_apply = {
        name: "奖项申请人数",
        value: data.length,
        icon: require("@/assets/home/envelope.png"),
        link: "rewardsDeclare/applyList",
      };
      this.messageCount = data;
      const total_apply_ing_length = data.filter(
        (item) => item.applyStatus == 1
      );
      const total_apply_up_length = data.filter(
        (item) => item.applyStatus == 2
      );
      const total_apply_ret_length = data.filter(
        (item) => item.applyStatus == 0
      );
      const total_apply_out_length = data.filter(
        (item) => item.applyStatus == -2
      );
      const total_apply_ing = {
        name: "奖项审核中人数",
        value: total_apply_ing_length.length,
        icon: require("@/assets/home/clock.png"),
        link: "allCheck/index",
      };
      const total_apply_up = {
        name: "奖项通过人数",
        value: total_apply_up_length.length,
        icon: require("@/assets/home/check.png"),
        link: "allCheck/index",
      };
      const total_apply_out = {
        name: "奖项未通过人数",
        value: total_apply_out_length.length,
        icon: require("@/assets/home/close.png"),
        link: "allCheck/index",
      };
      const total_apply_ret = {
        name: "奖项驳回人数",
        value: total_apply_ret_length.length,
        link: "allCheck/index",
      };
      this.nums.push(
        total_apply,
        total_apply_ing,
        total_apply_up,
        total_apply_out
      );
      // 模拟数据
      let index = new Date().getDay();
      let expectedData = [3, 5, 6, 2, 1, 2, 0];
      expectedData[index - 1] = total_apply_up.value;
      let actualData = [2, 3, 1, 2, 5, 5, 0];
      actualData[index - 1] = total_apply_out.value;
      this.chartData = {
        expectedData,
        actualData,
      };
      // this.$nextTick(()=>{
      //   this.$refs.PieChart_pie.chartData = [
      //   total_apply_up,
      //   total_apply_out,
      //   total_apply_ing,
      //   total_apply_ret
      // ]
      // })
    },
    async promiseRewardId() {
      const rewardId = this.rewardsData.map((item) => {
        return {
          name: item.rewardName,
          id: item.id,
        };
      });
      const PromiseAll = rewardId.map(
        (item) =>
          new Promise((resolve) => {
            getRewardResult({ rewardId: item.id })
              .then((res) => {
                resolve(res);
              })
              .catch((req) => {
                // 处理promise all 异常
                return Promise.resolve(req);
              });
          })
      );
      let res = await Promise.all(PromiseAll);
      res.filter((item, index) => (rewardId[index].value = item.data.length));
      // this.$nextTick(()=>{
      //   this.$refs.PieChart_raddar.chartData = rewardId
      // })
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  .num {
    display: flex; /*对于一行会自动弹性布局*/
    flex-wrap: wrap; /*对于6个模块需要换行*/
    justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
    .el-card {
      width: 32%;
      margin-bottom: 20px; /*模块之前有间隔*/
    }
  }
  .graph {
    display: flex; /*对于一行会自动弹性布局*/
    justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
    .el-card {
      width: 49%;
      margin-top: 20px; /*模块之前有间隔*/
    }
  }
  .user {
    display: flex;
    align-content: center;
  }
  .avatar {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
  }
  p {
    // font-size: 16px;
    color: #5e6d82;
    line-height: 1.5em;
  }
  .icon-img {
    width: 80px;
    height: 75px;
  }
  .card-panel {
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    &-num {
      font-size: 20px;
    }
  }
}
</style>
