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
        <el-form-item label="评优名称：">
          <el-input
            v-model="formSearch.name"
            placeholder="请输入评优名称"
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
          type="primary"
          size="small"
          icon="iconfont icon-Add"
          @click="addOrUpdateHandle(0)"
        >新增</el-button>
        <el-button
          :disabled="!disabled"
          size="small"
          icon="el-icon-delete"
          plain
          @click="deleteHandle(0)"
        >批量删除</el-button>
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
        <el-table-column align="center" type="selection" width="80" />
        <el-table-column
          align="center"
          type="index"
          :index="indexMethod"
          label="序号"
          width="80"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="评优名称"
        />
        <el-table-column
          prop="mark"
          header-align="center"
          align="center"
          label="评优描述"
        />
        <el-table-column
          prop="time"
          header-align="center"
          align="center"
          label="评优时间"
        />
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="学号"
        />
        <el-table-column
          prop="college"
          header-align="center"
          align="center"
          label="面向学院"
        />
        <el-table-column
          prop="condition"
          header-align="center"
          align="center"
          label="申请条件"
        />
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="iconfont icon-edit"
              plain
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              icon="iconfont icon-del"
              @click="deleteHandle(scope.row.id)"
            >删除</el-button>
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
          <el-form-item label="评优名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入评优名称" />
          </el-form-item>
          <el-form-item label="评优描述" prop="mark">
            <el-input v-model="dataForm.mark" placeholder="请输入评优描述" />
          </el-form-item>
          <el-form-item label="评优时间" prop="time">
            <el-input v-model="dataForm.time" placeholder="请输入评优时间" />
          </el-form-item>
          <el-form-item label="面向学院" prop="college">
            <el-input v-model="dataForm.college" placeholder="请输入面向学院" />
          </el-form-item>
          <el-form-item label="申请条件" prop="condition">
            <el-input
              v-model="dataForm.condition"
              placeholder="请输入申请条件"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="dataFormSubmit()"
          >确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRewardsRewordList } from '@/api/rewards'
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      addOrUpdateVisible: false,
      formSearch: {
        name: ''
      },
      disabled: false,
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },

      visible: false,
      loading: false,
      dataForm: {
        id: 0,
        name: '',
        mark: '',
        time: '',
        college: '',
        applicationAwards: ''
      },
      dataRule: {
        name: [
          { required: true, message: '评优名称不能为空', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '评优概述不能为空', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '评优时间不能为空', trigger: 'blur' }
        ],
        college: [
          { required: true, message: '面向学院不能为空', trigger: 'blur' }
        ],
        condition: [
          { required: true, message: '申请条件不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 页码修改成调至【】页
    document.getElementsByClassName(
      'el-pagination__jump'
    )[0].childNodes[0].nodeValue = '跳至'
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      let dataParam = {}
      dataParam = this.formSearch
      dataParam.currentPage = this.pageData.currentPage
      dataParam.pageSize = this.pageData.pageSize
      getRewardsRewordList(dataParam).then((response) => {
        this.tableData = response.data.items
        this.pageData.total = response.data.total
      })
    },
    // 自定义序号
    indexMethod(index) {
      index =
        index + 1 + (this.pageData.currentPage - 1) * this.pageData.pageSize
      return index
    },
    // 搜索
    onSearch(e) {
      this.getDataList()
    },
    // 重置
    onSearchReset() {
      this.pageData = {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
      this.formSearch = {}
      this.getDataList()
    },
    // 分页变化
    currentChange(currentPage) {
      this.pageData.currentPage = currentPage
      this.getDataList()
    },
    // 全选-单选 监听
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.disabled = this.multipleSelection.length !== 0
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.dialogInit(row)
      })
    },
    // 删除
    deleteHandle(id) {
      const delIds =
        id !== 0 ? [id] : this.multipleSelection.map((item) => item.id)
      if (delIds.length <= 0) {
        return
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除选中的数据
          reportItemDelete(delIds).then((response) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.getDataList()
              }
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    dialogInit(row) {
      this.dataForm.id = row.id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id !== 0) {
          // reportItemInfo(this.dataForm.id).then((response) => {
          this.dataForm.name = row.name
          this.dataForm.mark = row.mark
          this.dataForm.time = row.time
          this.dataForm.college = row.college
          this.dataForm.condition = row.condition
          // })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const param = {
            id: this.dataForm.id || undefined,
            name: this.dataForm.name,
            mark: this.dataForm.mark,
            time: this.dataForm.time,
            college: this.dataForm.college,
            condition: this.dataForm.condition
          }
          const type = this.dataForm.id !== 0 ? 'update' : 'add'
          reportItemAddOrUpdate(type, param)
            .then((response) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.loading = false
                  this.visible = false
                  this.getDataList()
                }
              })
            })
            .catch((error) => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
