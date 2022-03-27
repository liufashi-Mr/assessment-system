<template>
  <div>
    <div v-if="page">
      <el-card class="box-card">
        <el-table
          size="medium"
          :data="tableData"
          :header-cell-style="{
            'background-color': '#fafafa',
            color: '#444444',
          }"
          empty-text="暂无数据"
          style="
            border: 1px solid #ebeef5;
            width: 100%;
            border-bottom: none;
            font-size: 13px;
            overflow: auto;
          "
        >
          <el-table-column
            align="center"
            type="index"
            :index="indexMethod"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="studentName"
            header-align="center"
            align="center"
            label="姓名"
          />
          <el-table-column
            prop="studentNumber"
            header-align="center"
            align="center"
            label="学号"
          />
          <el-table-column
            prop="rewardName"
            header-align="center"
            align="center"
            label="申请奖项"
          />
          <el-table-column
            prop="typeId"
            header-align="center"
            align="center"
            label="学科"
          >
            <template slot-scope="scope">
              {{ getName(scope.row.typeId) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="collegeId"
            header-align="center"
            align="center"
            label="学院"
            ><template slot-scope="scope">
              {{ getName(scope.row.collegeId) }}
            </template></el-table-column
          >
          <el-table-column
            prop="majorId"
            header-align="center"
            align="center"
            label="专业"
            ><template slot-scope="scope">
              {{ getName(scope.row.majorId) }}
            </template></el-table-column
          >
          <el-table-column
            prop="grade"
            header-align="center"
            align="center"
            label="年级"
          />
          <el-table-column
            prop="applyDesc"
            header-align="center"
            align="center"
            label="申请理由"
          />
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="role === 'student'"
                type="primary"
                size="mini"
                icon="iconfont icon-edit"
                plain
                @click="toProcess(scope.row)"
                >去审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-if="!page">
      <div class="bg">
        <div>
          <el-steps :active="1">
            <el-step
              title="步骤 1"
              description="这是一段很长很长很长的描述性文字"
            ></el-step>
            <el-step
              title="步骤 2"
              description="这是一段很长很长很长的描述性文字"
            ></el-step>
            <el-step title="步骤 3" description="这段就没那么长了"></el-step>
          </el-steps>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  cancelApply,
  getApplyList,
  updateApply,
  getApplyDetail,
  confirmApply,
  getRewardDetail,
  getStudentDetail,
  getProcessDetail,
} from "@/api/rewards";
import { getUniverse } from "@/api/manage";
import { getToken } from "@/utils/auth";
export default {
  components: {
    apply: () => import("./apply.vue"),
  },
  data() {
    return {
      page: true,
      tableData: [],
      flattenUniverseList: [],
      role: "",
    };
  },
  created() {
    this.getRoleApplyList();
    getUniverse().then((res) => {
      this.flattenUniverseList = res.flatData;
    });
    this.role = getToken();
  },
  methods: {
    getRoleApplyList() {
      getApplyList({ role: this.role }).then((res) => {
        this.tableData = res.data;
      });
    },
    indexMethod(index) {
      index = index + 1;
      return index;
    },
    getName(id) {
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex((item) => item.id === id)
      ]?.name;
    },
    async toProcess({ applyId, rewardId, rewardProcess, studentId }) {
      this.page = false;
      try {
        const [apply, reward, flow, student] = Promise.all([
          await getApplyDetail({ applyId }),
          await getRewardDetail({ rewardId }),
          await getProcessDetail({ flowId: rewardProcess }),
          await getStudentDetail({ studentId }),
        ]);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  padding: 20px;
  width: 100%;
  height: 200px;
  background: url("../../assets/detailBg.png") center no-repeat;
  background-size: 100% 200px;
  > div {
    max-width: 900px;
    margin: 0 auto;
    margin-top: 50px;
  }
}
</style>
