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
        <el-table-column header-align="center" align="center" label="奖励范围">
          <template slot-scope="scope">
            <span>
              {{ getScope(scope) }}
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
              v-if="$store.getters.token === 'student'"
              type="primary"
              size="mini"
              icon="iconfont icon-edit"
              plain
              >申请</el-button
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
              v-if="$store.getters.token === 'office'"
              type="danger"
              size="mini"
              plain
              icon="iconfont icon-del"
              @click="deleteHandle(scope.row.id)"
              >删除</el-button
            >
            <el-button
              v-if="['office', 'admin'].includes($store.getters.token)"
              type="primary"
              size="mini"
              plain
              icon="iconfont icon-del"
              @click="processSelect(scope.row.id)"
              >选择流程</el-button
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
          action="http://localhost:3000/upload"
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
          <el-form-item label="领取开始时间" prop="startTime">
            <el-input
              v-model="dataForm.startTime"
              placeholder="请输入奖项时间"
            />
          </el-form-item>
          <el-form-item label="领取结束时间" prop="endTime">
            <el-input v-model="dataForm.endTime" placeholder="请输入面向学院" />
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
  </div>
</template>

<script>
import { getRewards } from "@/api/rewards";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      addOrUpdateVisible: false,
      formSearch: {
        keyword: "",
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
      },
    };
  },
  mounted() {
    // 页码修改成调至【】页
    document.getElementsByClassName(
      "el-pagination__jump"
    )[0].childNodes[0].nodeValue = "跳至";
    this.getDataList();
  },
  methods: {
    getScope(scope) {
      if (!scope.row.level) return "所有学生";
      return scope.row.collegeType || scope.row.collegeName || scope.row.major;
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
    deleteHandle(id) {
      const delIds =
        id !== 0 ? [id] : this.multipleSelection.map((item) => item.id);
      if (delIds.length <= 0) {
        return;
      }
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除选中的数据
          reportItemDelete(delIds).then((response) => {
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
    processSelect(id) {},
    dialogInit(row) {
      this.dataForm.id = row.id;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id !== 0) {
          // reportItemInfo(this.dataForm.id).then((response) => {
          this.dataForm.rewardName = row.rewardName;
          this.dataForm.description = row.description;
          this.dataForm.startTime = row.startTime || "";
          this.dataForm.endTime = row.endTime || "";
          // this.dataForm.condition = row.condition;
          // })
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const param = {
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            mark: this.dataForm.mark,
            time: this.dataForm.time,
            college: this.dataForm.college,
            condition: this.dataForm.condition,
          };
          const type = this.dataForm.id !== 0 ? "update" : "add";
          reportItemAddOrUpdate(type, param)
            .then((response) => {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.loading = false;
                  this.visible = false;
                  this.getDataList();
                },
              });
            })
            .catch((error) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
