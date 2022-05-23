<template>
  <div class="box">
    <div class="container">
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
          <el-button @click="$emit('setVisible')">取 消</el-button>
          <el-button type="primary" @click="submitApply()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
// 申请奖励弹窗
import { getInfo } from "@/utils/auth";
import { updateApply } from "@/api/rewards";
export default {
  props: ["detail", "applyDialogVisible"],
  data() {
    return {
      form: {
        applyId: "",
        studentId: "",
        applyDesc: "",
        applyAccessory: [],
        studentName: "",
        studentNumber: "",
      },
      dialogUrl: "",
      dialogVisible: false,
      fileList: [],
    };
  },
  created() {
    this.form = {
      ...this.form,
      applyId: this.detail.applyId,
      studentId: JSON.parse(getInfo())?.studentId,
      studentName: JSON.parse(getInfo())?.studentName,
      studentNumber: JSON.parse(getInfo())?.studentNumber,
      applyDesc: this.detail.applyDesc,
    };
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.container {
  ::v-deep .el-dialog__headerbtn {
    display: none;
  }
}
</style>
