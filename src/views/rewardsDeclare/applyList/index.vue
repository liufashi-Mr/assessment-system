<template>
  <div>
    <el-card class="box-card">
      <el-table
        size="medium"
        :data="tableData"
        :header-cell-style="{ 'background-color': '#fafafa', color: '#444444' }"
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
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              v-if="role === 'student'"
              type="primary"
              size="mini"
              icon="iconfont icon-edit"
              plain
              @click="updateApply(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              style="margin-right: 5px"
              v-if="role === 'student'"
              :type="scope.row.applyStatus === 0 ? 'warning' : 'primary'"
              size="mini"
              icon="iconfont icon-edit"
              plain
              @click="confirm(scope.row)"
              >{{ scope.row.applyStatus === 0 ? "去确认" : "查看" }}</el-button
            >
            <el-button
              style="margin-right: 5px"
              v-if="role !== 'student'"
              type="primary"
              size="mini"
              icon="iconfont icon-edit"
              plain
              @click="studentDetail(scope.row)"
              >详情</el-button
            >
            <el-popconfirm
              title="确定取消?"
              @onConfirm="deleteHandle(scope.row.applyId)"
            >
              <el-button
                v-if="role === 'student'"
                type="danger"
                size="mini"
                plain
                slot="reference"
                icon="iconfont icon-del"
                >取消</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="申请奖励"
      :visible.sync="applyDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="奖励名称">
          <el-input
            disabled
            v-model="detail.rewardName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input
            disabled
            v-model="form.studentName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生学号">
          <el-input
            disabled
            v-model="form.studentNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="申请理由">
          <el-input
            type="textarea"
            v-model="form.applyDesc"
            autocomplete="off"
          ></el-input>
          <div>
            <div>附件</div>
            <el-upload
              action="http://localhost:3001/file/upload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleUpload"
              :file-list="fileList"
              :limit="5"
              :before-upload="beforeUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png图片和excel，word，pdf文件，图片可预览
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApply()">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer size="800px" title="奖励详情" :visible.sync="drawer">
      <div class="drawer">
        <div>
          <div>奖励名称：</div>
          <div>{{ rewardDetail.rewardName }}</div>
        </div>
        <div v-if="rewardDetail.endTime || rewardDetail.startTime">
          <div>领取时间：</div>
          <div>
            {{ rewardDetail.startTime || "不限" }} ~
            {{ rewardDetail.endTime || "不限" }}
          </div>
        </div>
        <div v-if="!rewardDetail.endTime && !rewardDetail.startTime">
          <div>领取时间：</div>
          <div>不限制时间</div>
        </div>
        <div>
          <div>发放对象：</div>
          <div>
            {{
              (getName(rewardDetail.typeId) || "全体学生") +
              "/" +
              (getName(rewardDetail.college) || "--") +
              "/" +
              (getName(rewardDetail.majorId) || "--")
            }}
          </div>
        </div>
        <div>
          <div>描述/条件：</div>
          <div>{{ rewardDetail.rewardDesc }}</div>
        </div>
        <div>
          <div>流程描述：</div>
          <div>{{ rewardDetail.description }}</div>
        </div>
        <div style="height: 300px; font-size: 18px">
          <el-steps direction="vertical" :active="5">
            <el-step
              v-if="rewardDetail.stepOne"
              :title="rewardDetail.stepOne"
              description="审核流程第一步"
            ></el-step>
            <el-step
              v-if="rewardDetail.stepTwo"
              :title="rewardDetail.stepTwo"
              description="审核流程第二步"
            ></el-step>
            <el-step
              v-if="rewardDetail.stepThree"
              :title="rewardDetail.stepThree"
              description="审核流程第三步"
            ></el-step>
            <el-step
              v-if="rewardDetail.stepFour"
              description="审核流程第四步"
              :title="rewardDetail.stepFour"
            ></el-step>
            <el-step
              description="审核流程第五步"
              v-if="rewardDetail.stepFive"
              :title="rewardDetail.stepFive"
            ></el-step>
          </el-steps>
        </div>
        <div>
          <div>
            <h3>
              {{ this.role === "student" ? "你的成绩" : "学生信息" }}
            </h3>
            <el-table
              size="large"
              :data="markDetail"
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
          </div>
        </div>
        <div v-if="role === 'student'">
          <div>
            <div style="color: red">
              *
              为减轻学校老师工作量请同学们确定是否满足奖项的申请条件，若已获悉该奖励的申请条件,请点击确定来确定申请
            </div>
            <br />
            <div>
              <el-button
                v-if="applyStatus === 0"
                type="primary"
                size="mini"
                icon="iconfont icon-edit"
                plain
                @click="confirmSure()"
                >确定申请</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  cancelApply,
  getApplyList,
  updateApply,
  confirmApply,
  getRewardDetail,
  getStudentDetail,
  getApplyDetail,
} from "@/api/rewards";
import { getUniverse } from "@/api/manage";
import { getInfo, getToken } from "@/utils/auth";
export default {
  components: {
    apply: () => import("./apply.vue"),
  },
  data() {
    return {
      markDetail: [],
      applyId: "",
      tableData: [],
      drawer: false,
      rewardDetail: {},
      applyStatus: 0,
      stepNow: "",
      flattenUniverseList: [],
      detail: {},
      applyDialogVisible: false,
      dialogUrl: "",
      dialogVisible: false,
      fileList: [],
      form: {
        applyId: "",
        studentId: "",
        applyDesc: "",
        applyAccessory: [],
        studentName: "",
        studentNumber: "",
      },
      role: "",
    };
  },
  created() {
    getUniverse().then((res) => {
      this.flattenUniverseList = res.flatData;
    });
    this.role = getToken();
    this.getRoleApplyList();
  },
  methods: {
    getRoleApplyList() {
      getApplyList({
        studentId: getInfo() ? JSON.parse(getInfo())?.studentId : null,
      }).then((res) => {
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
    updateApply(id) {
      this.detail =
        this.tableData[this.tableData.findIndex((item) => item.id == id)];
      this.applyDialogVisible = true;
      this.form = {
        ...this.form,
        applyId: this.detail.applyId,
        studentId: JSON.parse(getInfo())?.studentId,
        studentName:  JSON.parse(getInfo())?.studentName,
        studentNumber:  JSON.parse(getInfo())?.studentNumber,
        applyDesc: this.detail.applyDesc,
      };
    },
    submitApply() {
      updateApply(this.form)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("修改成功,请确认");
            this.getRoleApplyList();
            this.applyDialogVisible = false;
          }
          this.applyDialogVisible = false;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("setVisible");
        });
    },
    handleRemove(file, fileList) {
      this.form.applyAccessory = fileList.map(
        (item) => item?.response?.photoPath
      );
    },
    handlePictureCardPreview(file) {
      let fileType = file.name.split(".")[1].toUpperCase();
      if (fileType === "PNG" || fileType === "JPG" || fileType === "JPEG") {
        this.dialogUrl = "http://localhost:3001/" + file?.response?.photoPath;
        this.dialogVisible = true;
      }
    },
    handleUpload(res, file, fileList) {
      this.form.applyAccessory = fileList.map(
        (item) => item?.response?.photoPath
      );
    },
    beforeUpload(file) {
      let fileType = file.name.split(".")[1].toUpperCase();
      if (
        !["PDF", "DOCX", "PNG", "JPG", "JPEG", "DOC", "XLSX", "CSV"].includes(
          fileType
        )
      ) {
        this.$message.error("文件格式有误");
        return false;
      } else {
        return true;
      }
    },
    deleteHandle(applyId) {
      cancelApply({ applyId }).then((res) => {
        if (res.code === 200) {
          this.$message.success("取消成功");
          this.getRoleApplyList();
        }
      });
    },
    confirm({ rewardId, applyId, studentId }) {
      this.applyId = applyId;
      this.rewardDetail = {};
      this.markDetail = [];
      this.drawer = true;
      getApplyDetail({ applyId }).then(({ data }) => {
        this.applyStatus = data[0]?.applyStatus;
      });
      getRewardDetail({ rewardId }).then(({ data }) => {
        this.rewardDetail = data;
      });
      getStudentDetail({ studentId }).then(({ data }) => {
        this.markDetail = data;
      });
    },
    confirmSure() {
      confirmApply({
        applyId: this.applyId,
        nextStep: this.rewardDetail.stepOne,
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success("确认成功,等待审批");
          this.getRoleApplyList();
          this.drawer = false;
        }
      });
    },
    studentDetail({ rewardId, studentId }) {
      getStudentDetail({ studentId }).then(({ data }) => {
        this.markDetail = data;
      });
      getRewardDetail({ rewardId })
        .then(({ data }) => {
          this.rewardDetail = data;
        })
        .finally(() => {
          this.drawer = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer {
  padding: 0 24px;
  > div {
    display: flex;
    font-size: 14px;
    margin-bottom: 18px;
    > div {
      margin-bottom: 8px;
    }
  }
}
</style>
