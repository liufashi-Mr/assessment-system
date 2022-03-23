<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>审核流程</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="visible = true"
          >新增</el-button
        >
      </div>
      <el-collapse v-for="item in processList" :key="item.id">
        <el-collapse-item :title="item.flowName" :name="item.id">
          <div class="box">
            <el-steps active="5">
              <el-step v-if="item.stepOne" :title="item.stepOne"></el-step>
              <el-step v-if="item.stepTwo" :title="item.stepTwo"></el-step>
              <el-step v-if="item.stepThree" :title="item.stepThree"></el-step>
              <el-step v-if="item.stepFour" :title="item.stepFour"></el-step>
              <el-step v-if="item.stepFive" :title="item.stepFive"></el-step>
            </el-steps>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="30vw"
      top="10vh"
    >
      <el-form
        ref="processForm"
        :model="processForm"
        label-width="80px"
        @keyup.enter.native="dataFormSubmit()"
      >
        <el-form-item label="流程名" prop="flowName">
          <el-input v-model="processForm.flowName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="第一步" prop="stepOne">
          <el-select v-model="processForm.stepOne" placeholder="请选择流程">
            <el-option label="指导老师" value="指导老师"></el-option>
            <el-option label="学院" value="学院"></el-option>
            <el-option label="学工处" value="学工处"></el-option>
            <el-option label="校分管" value="校分管"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第二步" prop="stepTwo">
          <el-select v-model="processForm.stepTwo" placeholder="请选择流程">
            <el-option label="指导老师" value="指导老师"></el-option>
            <el-option label="学院" value="学院"></el-option>
            <el-option label="学工处" value="学工处"></el-option>
            <el-option label="校分管" value="校分管"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第三步" prop="stepThree">
          <el-select v-model="processForm.stepThree" placeholder="请选择流程">
            <el-option label="指导老师" value="指导老师"></el-option>
            <el-option label="学院" value="学院"></el-option>
            <el-option label="学工处" value="学工处"></el-option>
            <el-option label="校分管" value="校分管"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第四步" prop="stepFour">
          <el-select v-model="processForm.stepFour" placeholder="请选择流程">
            <el-option label="指导老师" value="指导老师"></el-option>
            <el-option label="学院" value="学院"></el-option>
            <el-option label="学工处" value="学工处"></el-option>
            <el-option label="校分管" value="校分管"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="第五步" prop="stepFive">
          <el-select v-model="processForm.stepFive" placeholder="请选择流程">
            <el-option label="指导老师" value="teacher"></el-option>
            <el-option label="学院" value="college"></el-option>
            <el-option label="学工处" value="xuegongchu"></el-option>
            <el-option label="校分管" value="xiaofenguan"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="processForm.description"
            placeholder="请输入名称"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createProcess, getProcess } from "@/api/process";
export default {
  data() {
    return {
      visible: false,
      processForm: {
        flowName: "",
        stepOne: "",
        stepTwo: "",
        stepThree: "",
        stepFour: "",
        stepFive: "",
        description: "",
      },
      processList: [],
    };
  },
  created() {
    this.getProcessList();
  },
  methods: {
    async dataFormSubmit() {
      const res = await createProcess(this.processForm);
      if (res.code === 200) {
        this.$message.success("配置成功");
        this.visible = false;
      }
    },
    async getProcessList() {
      const { data } = await getProcess();
      this.processList = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  ::v-deep .el-collapse {
    border: none;
    // .el-collapse-item__header {
    //   border: none;
    // }
  }
  padding: 20px;
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .box {
    padding: 20px;
  }
}
</style>
