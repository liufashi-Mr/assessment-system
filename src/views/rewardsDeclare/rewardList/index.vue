<template>
  <div>
    <el-card class="box-card search-card">
      <el-form
        ref="formSearch"
        :inline="true"
        :model="formSearch"
        class="search-form"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="奖项名称：">
          <el-input
            v-model="formSearch.keyword"
            placeholder="请输入奖项名称"
            @keydown.enter.native="onSearch"
          />
        </el-form-item>
        <el-form-item label="专业/学院：">
          <el-cascader
            v-model="formSearch.studentValue"
            :options="universeList"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
            placeholder="请选择分类"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="年级：" prop="grade">
          <el-select v-model="formSearch.grade" placeholder="请选择学生年级">
            <el-option label="大一" value="大一"></el-option>
            <el-option label="大二" value="大二"></el-option>
            <el-option label="大三" value="大三"></el-option>
            <el-option label="大四" value="大四"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">
            <i style="font-size: 14px" class="el-icon-search" />
          </el-button>
          <el-button @click="onSearchReset">
            <i style="font-size: 14px" class="el-icon-refresh" />
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div style="margin-bottom: 10px">
        <el-button
          v-if="$store.getters.token === 'office'"
          type="primary"
          size="small"
          icon="iconfont icon-Add"
          @click="addOrUpdateHandle(0)"
          >新增</el-button
        >
      </div>
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
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column align="center" type="selection" width="80" /> -->
        <el-table-column
          align="center"
          type="index"
          :index="indexMethod"
          label="序号"
          width="80"
        />
        <el-table-column
          prop="rewardName"
          header-align="center"
          align="center"
          label="奖项名称"
        />
        <el-table-column
          prop="description"
          header-align="center"
          align="center"
          label="奖项描述"
        />
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="领取开始时间"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.startTime || "不限" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          header-align="center"
          align="center"
          label="领取结束时间"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.endTime || "不限" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <div>
              {{
                getStatus(
                  new Date(scope.row.startTime).getTime(),
                  new Date(scope.row.endTime).getTime()
                )
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="奖励范围">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.majorId || scope.row.collegeId || scope.row.typeId
                  ? getName(
                      scope.row.majorId ||
                        scope.row.collegeId ||
                        scope.row.typeId
                    )
                  : "全体学生"
              }}
            </span>
          </template></el-table-column
        >
        <el-table-column
          align="center"
          label="操作"
          width="250"
          v-if="['office', 'admin', 'student'].includes($store.getters.token)"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="
                getStatus(
                  new Date(scope.row.startTime).getTime(),
                  new Date(scope.row.endTime).getTime()
                ) === '已结束' ||
                getStatus(
                  new Date(scope.row.startTime).getTime(),
                  new Date(scope.row.endTime).getTime()
                ) === '未开始'
              "
              v-if="$store.getters.token === 'student'"
              type="primary"
              size="mini"
              icon="iconfont icon-edit"
              plain
              @click="applyReward(scope.row.id)"
              >申请</el-button
            >
            <el-button
              v-if="$store.getters.token === 'office'"
              type="danger"
              size="mini"
              plain
              icon="iconfont icon-del"
              @click="deleteHandle(scope.row.id)"
              >删除</el-button
            >
            <el-button
              v-if="$store.getters.token === 'office'"
              type="primary"
              size="mini"
              icon="iconfont icon-edit"
              plain
              @click="addOrUpdateHandle(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="
                ['office', 'admin', 'student'].includes($store.getters.token)
              "
              type="primary"
              size="mini"
              plain
              icon="iconfont icon-del"
              @click="getRewardDetailData(scope.row.id)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="block" style="margin: 15px 20px 20px 0; float: right">
        <el-pagination
          medium
          background
          :page-size="pageData.pageSize"
          :total="pageData.total"
          layout="total, prev, pager, next, jumper"
          @current-change="currentChange"
        />
      </div>
      <!-- <el-upload
          action="http://localhost:3001/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload> -->
      <!-- 弹窗, 新增 / 修改 -->
      <el-dialog
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="30vw"
        top="10vh"
      >
        <div style="color: red; margin-bottom: 20px; line-height: 24px">
          *注意： 时间不选择时则为长期有效，发放对象不选则为全体学生。
        </div>
        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="dataRule"
          label-width="80px"
          @keyup.enter.native="dataFormSubmit()"
        >
          <el-form-item label="奖项名称" prop="rewardName">
            <el-input
              v-model="dataForm.rewardName"
              placeholder="请输入奖项名称"
            />
          </el-form-item>
          <el-form-item label="奖项描述" prop="description">
            <el-input
              v-model="dataForm.description"
              placeholder="请输入奖项描述"
            />
          </el-form-item>
          <el-form-item label="专业/学院">
            <el-cascader
              v-model="dataForm.studentValue"
              :options="universeList"
              :props="{ checkStrictly: true, label: 'name', value: 'id' }"
              placeholder="请选择发放对象"
              filterable
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="dataForm.startTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="dataForm.endTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择流程" prop="process">
            <el-select
              v-model="dataForm.rewardProcess"
              placeholder="选择审核流程"
            >
              <el-option
                v-for="item in processList"
                :key="item.id"
                :label="item.flowName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="dataFormSubmit()"
            >确定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
    <el-drawer
      style="overflow-y: scroll"
      size="800px"
      title="奖励详情"
      :visible.sync="drawer"
    >
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
              rewardDetail.majorId ||
              rewardDetail.collegeId ||
              rewardDetail.typeId
                ? getName(
                    rewardDetail.majorId ||
                      rewardDetail.collegeId ||
                      rewardDetail.typeId
                  )
                : "全体学生"
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
      </div>
    </el-drawer>
    <apply
      :detail="rewardDetail"
      :applyDialogVisible="applyDialogVisible"
      @setVisible="applyDialogVisible = false"
    />
  </div>
</template>

<script>
import {
  getRewards,
  updateReward,
  addReward,
  removeReward,
  getRewardDetail,
} from "@/api/rewards";
import { getProcess } from "@/api/process";
import { getUniverse } from "@/api/manage";
import moment from "moment";
export default {
  components: {
    apply: () => import("./apply.vue"),
  },
  data() {
    return {
      drawer: false,
      universeList: [],
      applyDialogVisible: false,
      flattenUniverseList: [],
      tableData: [],
      multipleSelection: [],
      addOrUpdateVisible: false,
      processList: [],
      rewardDetail: {},
      formSearch: {
        keyword: "",
        studentValue: "",
        grade: "",
      },
      disabled: false,
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },

      visible: false,
      loading: false,
      dataForm: {
        id: 0,
        rewardName: "",
        description: "",
        startTime: "",
        endTime: "",
        studentValue: [],
        rewardProcess: 1,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
        ],
      },
      dataRule: {
        rewardName: [
          { required: true, message: "奖项名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "奖项概述不能为空", trigger: "blur" },
        ],
        // startTime: [
        //   { required: true, message: "奖项时间不能为空", trigger: "blur" },
        // ],
        // endTime: [
        //   { required: true, message: "面向学院不能为空", trigger: "blur" },
        // ],
        rewardProcess: [
          { required: true, message: "请选择流程", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    getProcess().then(({ data }) => (this.processList = data));
    getUniverse().then((res) => {
      this.universeList = res.data;
      this.flattenUniverseList = res.flatData;
    });
  },
  mounted() {
    // 页码修改成调至【】页
    document.getElementsByClassName(
      "el-pagination__jump"
    )[0].childNodes[0].nodeValue = "跳至";
    this.getDataList();
  },
  methods: {
    getStatus(s, e) {
      if (!s && !e) return "不限";
      const t = Date.now();
      if (t > s && t < e) {
        return "进行中";
      } else if (t < s) {
        return "未开始";
      } else {
        return "已结束";
      }
    },
    getName(id) {
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex((item) => item.id == +id)
      ]?.name;
    },
    // 获取数据列表
    getDataList() {
      let dataParam = {};
      dataParam = this.formSearch;
      dataParam.currentPage = this.pageData.currentPage;
      dataParam.pageSize = this.pageData.pageSize;
      getRewards(dataParam).then((response) => {
        this.tableData = response.data;
        this.pageData.total = this.tableData.length;
      });
    },
    // 自定义序号
    indexMethod(index) {
      index =
        index + 1 + (this.pageData.currentPage - 1) * this.pageData.pageSize;
      return index;
    },
    // 搜索
    onSearch(e) {
      this.getDataList();
    },
    // 重置
    onSearchReset() {
      this.pageData = {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      };
      this.formSearch = {};
      this.getDataList();
    },
    getRewardDetailData(rewardId, isApply) {
      this.rewardDetail = [];
      getRewardDetail({ rewardId })
        .then(({ data }) => {
          this.rewardDetail = data;
        })
        .finally(() => {
          if (!isApply) this.drawer = true;
        });
    },
    // 分页变化
    currentChange(currentPage) {
      this.pageData.currentPage = currentPage;
      this.getDataList();
    },
    // 全选-单选 监听
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.disabled = this.multipleSelection.length !== 0;
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.dialogInit(row);
      });
    },
    // 删除
    deleteHandle(rewardId) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除选中的数据
          removeReward({ rewardId }).then((response) => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.getDataList();
              },
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    dialogInit(row) {
      this.dataForm.id = row.id;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.dataForm.rewardName = row.rewardName;
          this.dataForm.description = row.description;
          this.dataForm.startTime = row.startTime
            ? new Date(row.startTime)
            : "";
          this.dataForm.endTime = row.endTime ? new Date(row.endTime) : "";
          this.dataForm.studentValue = [
            +row.typeId,
            +row.collegeId,
            +row.majorId,
          ].filter((item) => item);
          this.dataForm.rewardProcess = row.rewardProcess;
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.dataForm.studentValue);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            id: this.dataForm.id || undefined,
            rewardName: this.dataForm.rewardName,
            description: this.dataForm.description,
            startTime: this.dataForm.startTime
              ? moment(this.dataForm.startTime).format("YYYY-MM-DD")
              : "",
            endTime: this.dataForm.endTime
              ? moment(this.dataForm.endTime).format("YYYY-MM-DD")
              : "",
            typeId: this.dataForm.studentValue[0],
            collegeId: this.dataForm.studentValue[1],
            majorId: this.dataForm.studentValue[2],
            rewardProcess: this.dataForm.rewardProcess,
          };
          if (this.dataForm.id) {
            updateReward(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("修改成功");
                  this.visible = false;
                  this.loading = false;
                  this.getDataList();
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          } else {
            addReward(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("添加成功");
                  this.visible = false;
                  this.loading = false;
                  this.getDataList();
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          }
        }
      });
    },
    applyReward(id) {
      this.applyDialogVisible = true;
      this.getRewardDetailData(id, true);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-drawer__body {
    overflow-y: scroll;
  }
}
.drawer {
  padding: 0 24px;
  overflow-y: scroll;
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
