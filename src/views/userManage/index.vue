<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="学生管理" name="student">
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
              <el-form-item label="姓名：">
                <el-input
                  v-model="formSearch.studentName"
                  placeholder="请输入姓名"
                  @keydown.enter.native="onSearch"
                />
              </el-form-item>
              <el-form-item label="学号：">
                <el-input
                  v-model="formSearch.studentNumber"
                  placeholder="请输入学号"
                  @keydown.enter.native="onSearch"
                />
              </el-form-item>
              <el-form-item label="专业/学院">
                <el-cascader
                  v-model="formSearch.studentValue"
                  :options="universeList"
                  :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                  placeholder="请选择分类"
                  filterable
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="年级" prop="grade">
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
            <div style="margin-bottom: 10px; display: flex">
              <el-button
                type="primary"
                size="small"
                icon="iconfont icon-Add"
                @click="addOrUpdateHandle(0)"
                style="margin-right: 10px"
                >新增</el-button
              >
              <el-upload
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="importExcel"
              >
                <el-button size="small" type="primary">导入Excel</el-button>
              </el-upload>
              <el-link
                style="margin-left: 10px"
                href="http://localhost:3001/uploads/template/studentInfo.xlsx"
                type="primary"
              >
                下载模板
              </el-link>
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
                prop="studentNumber"
                header-align="center"
                align="center"
                label="学号"
              />
              <el-table-column
                prop="studentName"
                header-align="center"
                align="center"
                label="姓名"
              />
              <el-table-column
                prop="sex"
                header-align="center"
                align="center"
                label="性别"
              />

              <el-table-column
                prop="typeId"
                header-align="center"
                align="center"
                label="学科"
              >
                <template slot-scope="scope">
                  <div>
                    {{ getName(scope.row.typeId) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="collegeId"
                header-align="center"
                align="center"
                label="学院"
              >
                <template slot-scope="scope">
                  <div>
                    {{ getName(scope.row.majorId) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="majorId"
                header-align="center"
                align="center"
                label="专业"
              >
                <template slot-scope="scope">
                  <div>
                    {{ getName(scope.row.collegeId) }}
                  </div>
                </template></el-table-column
              >
              <el-table-column
                prop="grade"
                header-align="center"
                align="center"
                label="年级"
              />
              <el-table-column
                prop="studentStatus"
                header-align="center"
                align="center"
                label="状态"
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.studentStatus === 1 ? "在读" : "休学" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <div style="display: flex">
                    <el-button
                      type="primary"
                      style="margin-right: 8px"
                      size="mini"
                      icon="iconfont icon-edit"
                      plain
                      @click="addOrUpdateHandle(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="primary"
                      style="margin-right: 8px"
                      size="mini"
                      icon="iconfont icon-edit"
                      plain
                      @click="getSubjectList(scope.row.id)"
                    >
                      查看成绩
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="block" style="margin: 15px 20px 20px 0; float: right">
              <el-pagination
                medium
                background
                :page-size="formSearch.pageSize"
                :total="total"
                layout="total, prev, pager, next, jumper"
                @current-change="currentChange"
              />
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学校管理" name="universe">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>学科大类</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="setParentId()"
              >新增</el-button
            >
          </div>
          <el-collapse v-for="type in universeList" :key="type.id" accordion>
            <el-collapse-item :name="type.id">
              <template slot="title">
                <div class="description">
                  <span style="display: inline-block; margin-right: 20px">{{
                    type.name
                  }}</span>
                  <el-tooltip :content="type.description">
                    <span style="color: #97a8be"
                      >介绍：{{ type.description }}</span
                    >
                  </el-tooltip>
                </div>
              </template>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>学院</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="setParentId(type.id)"
                    >新增</el-button
                  >
                  <el-collapse
                    accordion
                    v-for="college in type.children"
                    :key="college.id"
                  >
                    <el-collapse-item :name="college.id">
                      <template slot="title">
                        <div class="description">
                          <span
                            style="display: inline-block; margin-right: 20px"
                            >{{ college.name }}</span
                          >
                          <el-tooltip :content="college.description">
                            <span style="color: #97a8be"
                              >介绍：{{ college.description }}</span
                            >
                          </el-tooltip>
                        </div>
                      </template>
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>专业</span>
                          <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="setParentId(college.id)"
                            >新增</el-button
                          >
                          <el-table
                            :data="college.children"
                            size="medium"
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
                              margin-top: 20px;
                            "
                          >
                            <el-table-column
                              prop="name"
                              header-align="left"
                              align="left"
                              label="专业名称"
                              width="250"
                            />
                            <el-table-column
                              prop="description"
                              header-align="left"
                              align="left"
                              label="介绍"
                            />
                          </el-table>
                        </div>
                      </el-card>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="新增"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="80px"
        @keyup.enter.native="dataFormSubmit()"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="dataForm.description"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitAdd()"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :title="!dataFormStu.studentId ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="stuVisible"
    >
      <el-form
        ref="dataFormStu"
        :model="dataFormStu"
        :rules="dataRule"
        label-width="80px"
        @keyup.enter.native="dataFormSubmit()"
      >
        <el-form-item label="姓名" prop="studentName">
          <el-input
            v-model="dataFormStu.studentName"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="学号" prop="studentNumber">
          <el-input
            v-model="dataFormStu.studentNumber"
            placeholder="请输入学号"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="dataFormStu.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="studentValue">
          <el-cascader
            v-model="dataFormStu.studentValue"
            :options="universeList"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择学科/学院/专业"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="状态" prop="studentStatus">
          <el-select
            v-model="dataFormStu.studentStatus"
            placeholder="请选择学生状态"
          >
            <el-option label="在读" value="1"></el-option>
            <el-option label="休学" value="2"></el-option>
            <el-option label="已毕业" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="dataFormStu.grade" placeholder="请选择学生年级">
            <el-option label="大一" value="大一"></el-option>
            <el-option label="大二" value="大二"></el-option>
            <el-option label="大三" value="大三"></el-option>
            <el-option label="大四" value="大四"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stuVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="dataFormSubmit()"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!--   
      :direction="direction"
      :before-close="handleClose" 
    -->
    <el-drawer
      size="800px"
      title="查看成绩"
      :visible.sync="drawer"
    >
      <div class="drawer">
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
            margin-bottom: 20px;
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
        <el-upload
          v-if="!markDetail.length"
          action=""
          :auto-upload="false"
          style="margin-right: 8px"
          :show-file-list="false"
          :on-change="importGrade"
        >
          <el-button
            size="small"
            type="primary"
            @click="getStudentId(scope.row)"
            >导入成绩</el-button
          >
        </el-upload>
        <el-upload
          v-if="markDetail.length"
          action=""
          :auto-upload="false"
          style="margin-right: 8px"
          :show-file-list="false"
          :on-change="importGrade"
        >
          <el-button
            size="small"
            type="primary"
            @click="getStudentId(scope.row)"
            >重新导入</el-button
          >
        </el-upload>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getUniverse,
  addUniverse,
  getStudent,
  updateStudent,
  addGrade,
  getGrade,
  addStudent,
} from "@/api/manage";
const initSearchData = {
  studentName: "",
  studentNumber: "",
  typeId: "",
  collegeId: "",
  majorId: "",
  pageSize: 10,
  currentPage: 1,
  grade: "",
};
export default {
  name: "UserManage",
  data() {
    return {
      drawer: false,
      markDetail: [],
      loading: false,
      activeName: "student",
      universeList: [],
      flattenUniverseList: [],
      visible: false,
      stuVisible: false,
      dataForm: {
        name: "",
        description: "",
      },
      dataFormStu: {
        studentId: "",
        studentName: "",
        studentNumber: "",
        studentValue: "",
        studentStatus: 1,
        sex: "",
        grade: "",
      },
      studentId: "",

      total: 0,
      tableData: [],
      multipleSelection: [],
      addOrUpdateVisible: false,
      formSearch: { ...initSearchData },
      disabled: false,
      dataRule: {
        studentName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        studentNumber: [
          { required: true, message: "学号不能为空", trigger: "blur" },
        ],
        studentValue: [
          {
            required: true,
            message: "学科/学院/专业不能为空",
            trigger: "blur",
          },
        ],
        studentStatus: [
          { required: true, message: "学生状态不能为空", trigger: "blur" },
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
      },
      studentAddList: [],
    };
  },
  created() {
    this.getUniverseList();
    this.getStudentList(this.formSearch);
    // [1, 2].map(() => {
    //   console.log(this);
    // });
  },
  methods: {
    indexMethod(index) {
      index = index + 1;
      return index;
    },
    // 搜索
    onSearch() {
      this.formSearch.currentPage = 1;
      this.formSearch.pageSize = 10;
      const searchParams = { ...this.formSearch };
      if (searchParams?.studentValue?.length) {
        searchParams.typeId = searchParams.studentValue[0];
        searchParams.collegeId = searchParams.studentValue[1] || "";
        searchParams.majorId = searchParams.studentValue[2] || "";
      }
      this.getStudentList(searchParams);
    },
    // 重置
    onSearchReset() {
      this.formSearch = initSearchData;
      this.getStudentList(initSearchData);
    },
    currentChange(currentPage) {
      this.formSearch.currentPage = currentPage;
      this.getStudentList(this.formSearch);
    },
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.dialogInit(row);
      });
    },
    importExcel(file, fileList) {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file.raw);
      fileReader.onload = (event) => {
        try {
          new Promise((resolve) => {
            const data = event.target.result;
            const infor = this.XLSX.read(data, { type: "binary" });
            let sheet = Object.keys(infor.Sheets)[0];
            const arr = this.XLSX.utils.sheet_to_json(infor.Sheets[sheet]); //第一列为键名的数组对象
            resolve(arr);
          }).then((arr) => {
            if (arr.length) {
              try {
                arr.forEach((item, index) => {
                  const params = {};
                  params.studentName = item["姓名"];
                  params.studentNumber = item["学号"];
                  params.sex = item["性别"];
                  params.typeId = this.getId(item["学科"]);
                  params.collegeId = this.getId(item["学院"]);
                  params.majorId = this.getId(item["专业"]);
                  params.studentStatus = item["状态"].trim() === "在读" ? 1 : 2;
                  params.grade = item["年级"];
                  addStudent(params)
                    .then((res) => {
                      if (res.code === 200) {
                        this.$message.success(`第${index + 1}个添加成功!`);
                        this.getStudentList(this.formSearch);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              } catch (error) {
                console.log(error);
                this.$message.error(error);
              }
            }
          });
        } catch (e) {}
      };
    },
    getSubjectList(studentId) {
      this.drawer = true;
      this.studentId = studentId;
      getGrade({ studentId }).then(({ data }) => {
        this.markDetail = data || [];
      });
    },
    getStudentId({ id }) {
      this.studentId = id;
    },
    importGrade(file, fileList, e) {
      console.log(file, fileList, e);
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file.raw);
      fileReader.onload = (event) => {
        try {
          new Promise((resolve) => {
            const data = event.target.result;
            const infor = this.XLSX.read(data, { type: "binary" });
            let sheet = Object.keys(infor.Sheets)[0];
            const arr = this.XLSX.utils.sheet_to_json(infor.Sheets[sheet]); //第一列为键名的数组对象
            resolve(arr);
          }).then((arr) => {
            if (arr.length) {
              try {
                arr.forEach((item, index) => {
                  console.log(item);
                  const params = {};
                  params.subject = item["科目"];
                  params.mark = item["成绩"];
                  params.studentId = this.studentId;
                  params.isPass = item["成绩"] >= 60 ? 1 : 0;
                  addGrade(params)
                    .then((res) => {
                      if (res.code === 200) {
                        this.$message.success(`第${index + 1}科添加成功!`);
                        this.getStudentList(this.formSearch);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
                setTimeout(() => {
                  this.getSubjectList(this.studentId);
                }, 1500);
              } catch (error) {
                console.log(error);
                this.$message.error(error);
              }
            }
          });
        } catch (e) {}
      };
    },
    getName(id) {
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex((item) => item.id === id)
      ].name;
    },
    getId(name) {
      console.log(name);
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex(
          (item) => item.name.trim() === name.trim()
        )
      ]?.id;
    },
    dialogInit(row) {
      this.dataFormStu.studentId = row.id;
      this.stuVisible = true;
      this.$nextTick(() => {
        this.$refs["dataFormStu"].resetFields();
        if (this.dataFormStu.studentId !== 0) {
          // reportItemInfo(this.dataForm.id).then((response) => {
          this.dataFormStu.studentName = row.studentName;
          this.dataFormStu.studentNumber = row.studentNumber;
          this.dataFormStu.studentValue = [
            row.typeId,
            row.collegeId,
            row.majorId,
          ];
          this.dataFormStu.studentStatus = row.studentStatus;
          this.dataFormStu.sex = row.sex;
          // })
        }
      });
    },
    dataFormSubmit() {
      this.$refs["dataFormStu"].validate((valid) => {
        if (valid) {
          const searchParams = { ...this.dataFormStu };
          if (searchParams.studentValue.length) {
            searchParams.typeId = searchParams.studentValue[0];
            searchParams.collegeId = searchParams.studentValue[1] || "";
            searchParams.majorId = searchParams.studentValue[2] || "";
          }
          this.loading = true;
          if (searchParams.studentId) {
            updateStudent(searchParams)
              .then((res) => {
                this.loading = false;
                this.stuVisible = false;
                if (res.code === 200) {
                  this.$message.success("修改成功");
                  this.getStudentList(this.formSearch);
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          } else {
            addStudent(searchParams)
              .then((res) => {
                this.loading = false;
                this.stuVisible = false;
                if (res.code === 200) {
                  this.$message.success("添加成功");
                  this.getStudentList(this.formSearch);
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
    // 自定义序号
    indexMethod(index) {
      index =
        index +
        1 +
        (this.formSearch.currentPage - 1) * this.formSearch.pageSize;
      return index;
    },
    async getUniverseList() {
      const res = await getUniverse();
      if (res.success) {
        this.universeList = res.data;
        this.flattenUniverseList = res.flatData;
      }
    },
    setParentId(parentId) {
      this.visible = true;
      this.parentId = parentId;
    },
    async submitAdd() {
      this.loading = true;
      const res = await addUniverse({
        ...this.dataForm,
        parentId: this.parentId,
      });
      if (res.code === 200) {
        this.$message.success("添加成功");
        this.visible = false;
      } else {
        this.$message.success("添加失败");
      }
      this.loading = false;
      this.getUniverseList();
    },
    async getStudentList(params) {
      const { data, total } = await getStudent(params);
      this.tableData = data;
      this.total = total;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  padding: 0 20px;
  ::v-deep .el-collapse {
    border: none;
    // .el-collapse-item__header {
    //   border: none;
    // }
  }
  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.search-card {
  margin-bottom: 16px;
}
.drawer {
  padding: 0 24px;
}
</style>
