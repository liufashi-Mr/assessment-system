<template>
  <div class="container">
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
              {{ getName(scope.row.typeId) || "不限" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="collegeId"
            header-align="center"
            align="center"
            label="学院"
            ><template slot-scope="scope">
              {{ getName(scope.row.collegeId) || "不限" }}
            </template></el-table-column
          >
          <el-table-column
            prop="majorId"
            header-align="center"
            align="center"
            label="专业"
            ><template slot-scope="scope">
              {{ getName(scope.row.majorId) || "不限" }}
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
               <el-tag v-if="scope.row.applyStatus === -2" type="danger">
                不通过
              </el-tag>
              <el-tag v-if="scope.row.applyStatus === 0" type="danger">
                已驳回
              </el-tag>
              <el-tag v-if="scope.row.applyStatus === 1" type="primary">
                审核中
              </el-tag>
              <el-tag v-if="scope.row.applyStatus === 2" type="success">
                已通过
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="role !== 'student'&&scope.row.applyStatus === 2"
                type="primary"
                size="mini"
                icon="iconfont icon-edit"
                plain
                @click="toProcess(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-if="!page">
      <div class="bg">
        <el-button size="mini" @click="page = true">返回</el-button>
        <div>
          <el-steps
            :active="+getActiveStep(applyDetail && applyDetail.applyStep)"
          >
            <el-step
              v-if="processDetail.stepOne"
              :title="processDetail.stepOne"
            ></el-step>
            <el-step
              v-if="processDetail.stepTwo"
              :title="processDetail.stepTwo"
            ></el-step>
            <el-step
              v-if="processDetail.stepThree"
              :title="processDetail.stepThree"
            ></el-step>
            <el-step
              v-if="processDetail.stepFour"
              :title="processDetail.stepFour"
            ></el-step>
            <el-step
              v-if="processDetail.stepFive"
              :title="processDetail.stepFive"
            ></el-step>
          </el-steps>
        </div>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>奖励信息</span>
        </div>
        <div class="text item">奖励名称：{{ rewardDetail.rewardName }}</div>
        <div class="text item">
          发放对象：{{
            (getName(rewardDetail.typeId) || "全体学生") +
            "/" +
            (getName(rewardDetail.college) || "--") +
            "/" +
            (getName(rewardDetail.majorId) || "--")
          }}
        </div>
        <div class="text item">
          时间：{{ rewardDetail.startTime + " ~ " + rewardDetail.endTime }}
        </div>
        <div class="text item">描述：{{ rewardDetail.rewardDesc }}</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>申请信息</span>
        </div>
        <div class="text item">学生姓名：{{ applyDetail.studentName }}</div>
        <div class="text item">学生学号：{{ applyDetail.studentNumber }}</div>
        <div class="text item">
          来自：{{
            getName(studentDetail[0].typeId) +
            "/" +
            getName(studentDetail[0].collegeId) +
            "/" +
            getName(studentDetail[0].majorId)
          }}
        </div>
        <div class="text item">申请理由：{{ applyDetail.applyDesc }}</div>
        <div class="text item" style="display: flex">
          <div>附件：</div>
          <div>
            <div
              v-for="item in JSON.parse(applyDetail.applyAccessory)"
              :key="item"
            >
              <el-link type="primary" @click="filePreview(item)">
                <a target="_blank" :href="'http://localhost:3001' + item"
                  >{{ item }} 查看</a
                >
              </el-link>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>成绩信息</span>
        </div>
        <el-table
          size="large"
          :data="studentDetail"
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
            width="180"
            prop="subject"
            header-align="center"
            align="center"
            label="科目"
          />
          <el-table-column
            prop="mark"
            header-align="center"
            align="center"
            label="分数"
          />
          <el-table-column
            prop="isPass"
            header-align="center"
            align="center"
            label="及格"
          >
            <template slot-scope="scope">
              {{ scope.row.isPass ? "是" : "否" }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="footer" v-if="applyDetail.applyStatus!==2">
        <el-card class="box-card">
          <el-button type="danger" @click="check(0)">驳回</el-button>
          <el-button type="primary" @click="check(2)">通过</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getApplyList,
  getApplyDetail,
  getRewardDetail,
  getStudentDetail,
  getProcessDetail,
} from "@/api/rewards";
import { auditProcess } from "@/api/process";
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
      applyDetail: { applyAccessory: "[]" },
      rewardDetail: {},
      processDetail: {},
      studentDetail: [{}],
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
    check(val) {
      this.$confirm(`点击确定将${val ? "通过" : "驳回"}该申请`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          auditProcess({
            isPass: val,
            applyId: this.applyDetail.id,
            nextStep: this.getNextStep(this.applyDetail.applyStep),
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success(val ? "审核已通过" : "审核已驳回");
              this.getRoleApplyList();
              this.page = true;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    getRoleApplyList() {
      getApplyList({ role: getToken() }).then((res) => {
        this.tableData = res.data;
      });
    },
    indexMethod(index) {
      index = index + 1;
      return index;
    },
    getName(id) {
      if (!id) return;
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex((item) => item.id === id)
      ]?.name;
    },
    async toProcess({ applyId, rewardId, rewardProcess, studentId }) {
      this.page = false;
      try {
        const [apply, reward, flow, student] = await Promise.all([
          await getApplyDetail({ applyId }),
          await getRewardDetail({ rewardId }),
          await getProcessDetail({ flowId: rewardProcess }),
          await getStudentDetail({ studentId }),
        ]);
        console.log(apply, reward, flow, student);
        this.applyDetail = apply.data[0];
        this.rewardDetail = reward.data;
        this.processDetail = flow.data[0];
        this.studentDetail = student.data;
      } catch (error) {
        console.log(error);
      }
    },
    filePreview(file) {
      // const fileType = file
      //   .split(".")
      //   [file.split(".").length - 1].toUpperCase();
      // if (["DOCX", "XLSX", "DOC", "CSV"].includes(fileType)) {
      // window.open(
      //   `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      //     "http://localhost:3001/" + file
      //   )}`,
      //   "_blank"
      // );
      // } else {
      window.open(`http://localhost:3001/${file}`, "_blank");
      // }
    },
    getNextStep(current) {
      console.log(current);
      let res = "";
      Object.keys(this.processDetail).forEach((item, index) => {
        if (this.processDetail[item] === current) {
          switch (item) {
            case "stepOne": {
              res = this.processDetail["stepTwo"] || "完成";
              return;
            }
            case "stepTwo": {
              res = this.processDetail["stepThree"] || "完成";
              return;
            }
            case "stepThree": {
              res = this.processDetail["stepFour"] || "完成";
              return;
            }
            case "stepFour": {
              res = this.processDetail["stepFive"] || "完成";
              return;
            }
          }
        }
      });
      return res;
    },
    getActiveStep(current) {
      let res = "";
      if(current==="完成")return 5
      Object.keys(this.processDetail).forEach((item, index) => {
        if (this.processDetail[item] === current) {
          switch (item) {
            case "stepOne": {
              res = 0;
              return;
            }
            case "stepTwo": {
              res = 1;
              return;
            }
            case "stepThree": {
              res = 2;
              return;
            }
            case "stepFour": {
              res = 3;
              return;
            }
            default: {
              res = 4;
              return;
            }
          }
        }
      });
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  padding-bottom: 100px;
  position: relative;
}
.bg {
  padding: 20px;
  width: 100%;
  height: 200px;
  background: url("../../assets/detailBg.png") center no-repeat;
  background-size: 100% 200px;
  > div {
    max-width: 900px;
    margin: 20px auto;
  }
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  margin-top: 10px;
}
.footer {
  height: 60px;
  padding: 10px;
  right: 20px;
  z-index: 999;
  background-color: #fff;
  text-align: end;
  position: fixed;
  bottom: 40px;
}
</style>
