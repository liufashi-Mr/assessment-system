<template>
  <div class="container">
    <el-tabs v-model="defaultTab">
      <el-tab-pane label="按奖项导出" name="first">
        <div class="switch">
          <div>查看所有：</div>
          <el-switch
            v-model="getAll"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <el-card
          style="margin-top: 16px"
          v-loading="loading"
          element-loading-text="拼命加载中"
        >
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
      </el-tab-pane>
      <el-tab-pane label="按条件导出" name="second">
        <el-card style="margin-bottom: 24px" class="box-card search-card">
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
              <el-select
                v-model="formSearch.grade"
                placeholder="请选择学生年级"
              >
                <el-option label="大一" value="大一"></el-option>
                <el-option label="大二" value="大二"></el-option>
                <el-option label="大三" value="大三"></el-option>
                <el-option label="大四" value="大四"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间：" prop="date">
              <el-date-picker
                v-model="formSearch.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :picker-options="searchPickerOptions"
              >
              </el-date-picker>
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
          <div class="btn">
            <download-excel
              class="export-btn"
              :data="allResult || []"
              :fields="jsonFields"
              type="xls"
              header="全部数据报表"
              name="全部报表.xls"
            >
              <el-button type="success"> 导出 </el-button>
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
          <el-card style="margin-top: 24px">
            <el-table
              size="medium"
              :data="allResult"
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
                prop="studentName"
                header-align="center"
                align="center"
                label="学号"
              />
              <el-table-column
                prop="applyDesc"
                header-align="center"
                align="center"
                label="申请理由"
              />
              <el-table-column
                prop="applyDesc"
                header-align="center"
                align="center"
                label="审核状态"
              >
                <template slot-scope="scope">
                  <div>
                    {{ getStatus(scope.row.applyStatus) }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-card>
      </el-tab-pane>
    </el-tabs>
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
      defaultTab: "first",
      universeList: [],
      flattenUniverseList: [],
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
      formSearch: {
        keyword: "",
        studentValue: "",
        grade: "",
        date: "",
      },
      searchPickerOptions: {
        shortcuts: [
          {
            text: "本学期",
            onClick(picker) {
              const nowTime = new Date();
              const nowTerm = nowTime.getMonth() + 1;
              if (nowTerm >= 3 && nowTerm <= 8) {
                picker.$emit("pick", [
                  new Date().setMonth(2),
                  new Date().setMonth(8),
                ]);
              } else {
                picker.$emit("pick", [
                  new Date().setMonth(9),
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  ).setMonth(1),
                ]);
              }
            },
          },
          {
            text: "本学年",
            onClick(picker) {
              const nowTime = new Date();
              const nowTerm = nowTime.getMonth() + 1;
              if (nowTerm >= 3 && nowTerm <= 8) {
                picker.$emit("pick", [
                  new Date(
                    nowTime.setFullYear(nowTime.getFullYear() - 1)
                  ).setMonth(8),
                  new Date().setMonth(8),
                ]);
              } else {
                picker.$emit("pick", [
                  new Date().setMonth(2),
                  new Date(
                    nowTime.setFullYear(nowTime.getFullYear() + 1)
                  ).setMonth(2),
                ]);
              }
            },
          },
        ],
      },
    };
  },
  created() {
    getUniverse().then((res) => {
      this.universeList = res.data;
      this.flattenUniverseList = res.flatData;
    });
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
    indexMethod(index) {
      index =
        index + 1 + (this.pageData.currentPage - 1) * this.pageData.pageSize;
      return index;
    },
    onSearch(allResult) {
      const dataParam = { ...this.formSearch };
      if (dataParam?.studentValue?.length) {
        dataParam.typeId = dataParam.studentValue[0];
        dataParam.collegeId = dataParam.studentValue[1] || "";
        dataParam.majorId = dataParam.studentValue[2] || "";
      }
      if (dataParam?.date?.length) {
        dataParam.date = dataParam.date.map((x) => moment(x).format("YYYY-MM"));
      }
      getRewards(dataParam).then(({ data }) => {
        const res = data.map((x) => x.id);
        if (allResult?.length) {
          this.allResult = allResult.filter((x) =>
            res.includes(x.rewardId)
          );
        }else{
          this.allResult = this.allResult.filter((x) =>
            res.includes(x.rewardId)
          );
        }
        if (!this.allResult.length) {
          this.$message.error("此条件下没有符合条件的");
        }
      });
    },
    onSearchReset() {},
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
        this.onSearch((data.length && data) || []);
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
.switch {
  margin-left: 20px;
  display: flex;
  align-items: center;
}
</style>
