<template>
  <div class="container">
    <div class="btn">
      <download-excel
        class="export-btn"
        :data="allResult || []"
        :fields="jsonFields"
        type="xls"
        header="全部数据报表"
        name="全部报表.xls"
      >
        <el-button type="success"> 全部导出 </el-button>
      </download-excel>
      <div class="switch">
        <div>查看所有：</div>
        <el-switch
          v-model="getAll"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </div>
    </div>
    <el-card v-loading="loading" element-loading-text="拼命加载中">
      <el-collapse accordion @change="handleChange">
        <el-collapse-item
          v-for="item in rewardList"
          :key="item.id"
          :title="item.rewardName"
          :name="item.id"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div class="btn">
                <download-excel
                  class="export-btn"
                  :data="tableData"
                  :fields="jsonFields"
                  type="xls"
                  header="数据报表"
                  name="数据报表.xls"
                  ><el-button size="mini" type="success"
                    >导出报表</el-button
                  ></download-excel
                >
              </div>
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
                  prop="rewardName"
                  header-align="center"
                  align="center"
                  label="奖项名"
                />
                <el-table-column
                  prop="description"
                  header-align="center"
                  align="center"
                  label="奖项要求"
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
                  prop="applyDesc"
                  header-align="center"
                  align="center"
                  label="申请理由"
                />
                <el-table-column
                  prop="applyStatus"
                  header-align="center"
                  align="center"
                  label="审核状态"
                  ><template slot-scope="scope">
                    {{ getStatus(scope.row.applyStatus) }}
                  </template></el-table-column
                >
                >
              </el-table>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import JsonExcel from "vue-json-excel";
import { getRewardResult, getRewards, getAllRewardResult } from "@/api/rewards";
import { getUniverse } from "@/api/manage";
export default {
  components: {
    DownloadExcel: JsonExcel,
  },
  data() {
    return {
      loading: false,
      getAll: false,
      allResult: [],
      tableData: [],
      flattenUniverseList: [],
      rewardList: [],
      jsonFields: {
        //导出Excel表格的表头设置
        奖项名: "rewardName",
        奖项要求: "description",
        姓名: "studentName",
        学号: "studentNumber",
        学科: "",
        学院: "",
        专业: "",
        申请理由: "applyDesc",
        审核状态: "",
      },
      rewardId: "",
    };
  },
  created() {
    getAllRewardResult({ getAll: this.getAll }).then(({ data }) => {
      this.allResult = (data.length && data) || [];
    });
    this.jsonFields = {
      ...this.jsonFields,
      学科: {
        field: "typeId",
        callback: (value) => {
          return this.getName(value) || "不限";
        },
      },
      学院: {
        field: "collegeId",
        callback: (value) => {
          return this.getName(value) || "不限";
        },
      },
      专业: {
        field: "majorId",
        callback: (value) => {
          return this.getName(value) || "不限";
        },
      },
      审核状态: {
        field: "applyStatus",
        callback: (value) => this.getStatus(value),
      },
    };
    this.getRewardList();
    getUniverse().then((res) => {
      this.flattenUniverseList = res.flatData;
    });
  },
  methods: {
    getStatus(value) {
      if (value === -1) {
        return "待学生确认";
      } else if (value === -1) {
        return "暂未通过";
      } else if (value === 1) {
        return "审批中";
      } else {
        return "已审批";
      }
    },
    getRewardList() {
      getRewards().then(({ data }) => {
        this.rewardList = data;
      });
    },
    getName(id) {
      if (!id) return;
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex((item) => item.id === id)
      ]?.name;
    },
    handleChange(rewardId) {
      this.rewardId = rewardId;
      if (rewardId) {
        this.loading = true;
        getRewardResult({ rewardId, getAll: this.getAll }).then(({ data }) => {
          this.tableData = (data.length && data) || [];
          this.loading = false;
        });
      }
    },
    indexMethod(index) {
      index = index + 1;
      return index;
    },
  },
  watch: {
    getAll() {
      getAllRewardResult({ getAll: this.getAll }).then(({ data }) => {
        this.allResult = (data.length && data) || [];
      });
      this.handleChange(this.rewardId);
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  margin-top: 20px;
  padding: 0 20px;
  ::v-deep .el-collapse {
    border: none;
    // .el-collapse-item__header {
    //   border: none;
    // }
  }
}
.btn {
  margin-bottom: 10px;
  display: flex;
  line-height: 1;
  line-height: 36px;
  .switch {
    margin-left: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
