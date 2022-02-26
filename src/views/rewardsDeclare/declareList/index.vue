<template>
  <div>
    <el-card class="box-card search-card">
      <el-form
        :inline="true"
        :model="formSearch"
        ref="formSearch"
        class="search-form"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="分析项名称：">
          <el-input
            v-model="formSearch.name"
            placeholder="请输入分析项名称"
            @keydown.enter.native="onSearch"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onSearch">
            <i style="font-size: 14px" class="el-icon-search"></i>
          </el-button>
          <el-button  @click="onSearchReset">
            <i style="font-size: 14px" class="el-icon-refresh"></i>
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
          >新增</el-button
        >
        <el-button
          :disabled="!disabled"
          size="small"
          icon="el-icon-delete"
          @click="deleteHandle(0)"
          plain
          >批量删除</el-button
        >
      </div>
      <el-table
        size="medium"
        :data="tableData"
        :header-cell-style="{ 'background-color': '#fafafa', color: '#444444' }"
        @selection-change="handleSelectionChange"
        empty-text="暂无数据"
        style="border: 1px solid #ebeef5; width: 100%; border-bottom: none; font-size: 13px; overflow: auto"
      >
        <el-table-column align="center" type="selection" width="80"></el-table-column>
        <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
        <el-table-column prop="funmethod" header-align="center" align="center" label="分析功能"></el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
        <el-table-column prop="param" header-align="center" align="center" label="参数"></el-table-column>
        <el-table-column prop="label" header-align="center" align="center" label="书签"></el-table-column>
        <el-table-column prop="dataFormat" header-align="center" align="center" label="数值格式"></el-table-column>
        <el-table-column prop="updateBy" header-align="center" align="center" label="更新人"></el-table-column>
        <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="addOrUpdateHandle(scope.row.id)"
              icon="iconfont icon-edit"
              plain
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              plain
              @click="deleteHandle(scope.row.id)"
              icon="iconfont icon-del"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="block" style="margin: 15px 20px 20px 0; float: right">
        <el-pagination
          medium
          background
          @current-change="currentChange"
          :page-size="pageData.pageSize"
          :total="pageData.total"
          layout="total, prev, pager, next, jumper"
        >
        </el-pagination>
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
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="80px"
        >
          <el-form-item label="分析功能" prop="funmethod">
            <el-input v-model="dataForm.funmethod" placeholder="请输入分析功能"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="参数" prop="param">
            <el-input v-model="dataForm.param" placeholder="请输入参数"></el-input>
          </el-form-item>
          <el-form-item label="书签" prop="label">
            <el-input v-model="dataForm.label" placeholder="请输入书签"></el-input>
          </el-form-item>
          <el-form-item label="数值格式" prop="dataFormat">
            <el-input v-model="dataForm.dataFormat" placeholder="请输入数值格式"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="dataFormSubmit()">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      addOrUpdateVisible: false,
      formSearch: {
        name: '',
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
        funmethod: '',
        name: '',
        param: '',
        label: '',
        dataFormat: '',
        delStatus: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        remark: '',
      },
      dataRule: {
        funmethod: [{ required: true, message: '分析功能不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '分析项名称不能为空', trigger: 'blur' }],
        param: [{ required: true, message: '参数不能为空', trigger: 'blur' }],
        label: [{ required: true, message: '书签不能为空', trigger: 'blur' }],
        dataFormat: [{ required: true, message: '数值格式不能为空', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    // 页码修改成调至【】页
    document.getElementsByClassName('el-pagination__jump')[0].childNodes[0].nodeValue = '跳至';
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      let dataParam = {};
      dataParam = this.formSearch;
      dataParam.currentPage = this.pageData.currentPage;
      dataParam.pageSize = this.pageData.pageSize;
      reportItemList(dataParam).then(response => {
        this.tableData = response.data;
        this.pageData.total = response.count;
      });
    },
    // 自定义序号
    indexMethod(index) {
      index = index + 1 + (this.pageData.currentPage - 1) * this.pageData.pageSize;
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
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.dialogInit(id);
      });
    },
    // 删除
    deleteHandle(id) {
      let delIds = id !== 0 ? [id] : this.multipleSelection.map(item => item.id);
      if (delIds.length <= 0) {
        return;
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 删除选中的数据
          reportItemDelete(delIds).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.getDataList();
              },
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    dialogInit(id) {
      this.dataForm.id = id;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.id !== 0) {
          reportItemInfo(this.dataForm.id).then(response => {
            this.dataForm.funmethod = response.data.funmethod;
            this.dataForm.name = response.data.name;
            this.dataForm.param = response.data.param;
            this.dataForm.label = response.data.label;
            this.dataForm.dataFormat = response.data.dataFormat;
            this.dataForm.delStatus = response.data.delStatus;
            this.dataForm.createBy = response.data.createBy;
            this.dataForm.createTime = response.data.createTime;
            this.dataForm.updateBy = response.data.updateBy;
            this.dataForm.updateTime = response.data.updateTime;
            this.dataForm.remark = response.data.remark;
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          let param = {
            id: this.dataForm.id || undefined,
            funmethod: this.dataForm.funmethod,
            name: this.dataForm.name,
            param: this.dataForm.param,
            label: this.dataForm.label,
            dataFormat: this.dataForm.dataFormat,
            delStatus: this.dataForm.delStatus,
            createBy: this.dataForm.createBy,
            createTime: this.dataForm.createTime,
            updateBy: this.dataForm.updateBy,
            updateTime: '',
            remark: this.dataForm.remark,
          };
          let type = this.dataForm.id !== 0 ? 'update' : 'add';
          reportItemAddOrUpdate(type, param)
            .then(response => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.loading = false;
                  this.visible = false;
                  this.getDataList();
                },
              });
            })
            .catch(error => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
