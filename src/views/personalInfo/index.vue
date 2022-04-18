<template>
  <div class="container">
    <el-card class="box-card search-card">
      <div class="text item">
        <div>
          <span>姓名：</span>
          <span>{{ baseInfo.studentName }}</span>
        </div>
        <div>
          <span>学号：</span>
          <span>{{ baseInfo.studentNumber }}</span>
        </div>
        <div>
          <span>用户名：</span>
          <span>{{ baseInfo.username }}</span>
        </div>
        <div>
          <span>学科：</span>
          <span>{{ getName(baseInfo.typeId) }}</span>
        </div>
        <div>
          <span>学院：</span>
          <span>{{ getName(baseInfo.collegeId) }}</span>
        </div>
        <div>
          <span>专业：</span>
          <span>{{ getName(baseInfo.majorId) }}</span>
        </div>
        <div>
          <span>年级：</span>
          <span>{{ baseInfo.grade }}</span>
        </div>
        <div v-if="baseInfo.studentNumber !== baseInfo.password">
          <span>密码：</span>
          <span>**********</span>
        </div>
      </div>
      <div style="margin-bottom: 10px">
        <el-button
          type="primary"
          size="small"
          icon="iconfont icon-Add"
          @click="visible = true"
          >修改用户名密码</el-button
        >
      </div>
    </el-card>
    <el-dialog
      title="修改信息"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        ref="info"
        label-width="90px"
        :model="info"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="用户名：">
          <el-input v-model="info.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="旧密码：">
          <el-input
            type="password"
            v-model="info.oldPassword"
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input
            type="password"
            v-model="info.newPassword"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="确认密码：">
          <el-input
            type="password"
            v-model="info.password"
            placeholder="请确认密码"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="infoSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInfo, getToken } from "@/utils/auth";
import { getStudentInfo, getUniverse, updateStudentInfo } from "@/api/manage";
export default {
  data() {
    return {
      flattenUniverseList: [],
      imageUrl: "",
      visible: false,
      studentId: "",
      baseInfo: {},
      info: {
        username: "",
        oldPassword: "",
        newPassword: "",
        password: "",
      },
    };
  },
  created() {
    getUniverse().then((res) => {
      this.universeList = res.data;
      this.flattenUniverseList = res.flatData;
    });
    this.studentId = JSON.parse(getInfo()).studentId;
    getStudentInfo({ studentId: this.studentId }).then((res) => {
      this.baseInfo = res.data[0];
      this.info.username=this.baseInfo.username
    });
  },
  methods: {
    handleAvatarSuccess() {},
    infoSubmit() {
      if (!this.info.username.trim() || !this.info.password.trim()) {
        this.$message.error("用户名密码不能为空");
        return;
      }

      if (this.info.oldPassword !== this.baseInfo.password) {
        this.$message.error("密码错误");
        return;
      }
      if (this.info.password !== this.info.newPassword) {
        this.$message.error("两次输入不一致");
        return;
      }
      updateStudentInfo({ studentId: this.studentId, ...this.info }).then(res=>{
          if(res.code===200){
              this.$message.success('修改成功')
              this.visible=false
          }
      });
    },
    getName(id) {
      return this.flattenUniverseList[
        this.flattenUniverseList.findIndex((item) => item.id == +id)
      ]?.name;
    },
  },
};
</script>

<style scoped lang='scss'>
.container {
  padding: 20px;
}
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.text {
  width: 1180px;
  margin: 0 auto;
  font-size: 14px;
  > div {
    margin-top: 20px;
  }
}

.item {
  margin-bottom: 24px;
}
.box-card {
  width: 1180px;
  margin: 0 auto;
}
</style>

