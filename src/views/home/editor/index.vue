<template>
    <div>  <!--与上边距相差 20px的距离-->
      <el-row class="home" :gutter="20">
　　     <!--左边占据 8 -->
        <el-col :span="8">
          <!--上面个人信息-->
          <el-card shadow="hover" style="height: 290px">
            鼠标悬浮时显显示
          </el-card>
          <!--下面信息框-->
          <el-card shadow="hover" style="height: 633px;margin-top: 20px">
            鼠标悬浮时显显示
          </el-card>
        </el-col>
        <!--右边占据16-->
        <el-col :span="16">
          <!--6个显示金额-->
          <div class="num">
            <el-card shadow="hover" v-for="item in 6" :key="item">
              <i class="icon"></i>
              <div class="detail">
                <p class="num">￥ 1234</p>
                <p class="txt">今日支付订单</p>
              </div>
            </el-card>
          </div>
          <!--显示流程图-->
          <el-card shadow="hover">
            <div style="height: 280px"></div>
          </el-card>
         <!--左边最下面两个流程图-->
          <div class="graph">
            <el-card shadow="hover">
              <div style="height: 260px"></div>
            </el-card>
            <el-card shadow="hover">
              <div style="height: 260px"></div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.home .num {
  display: flex; /*对于一行会自动弹性布局*/
  flex-wrap: wrap; /*对于6个模块需要换行*/
  justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
}
 
.home .num .el-card {
  width: 32%;
  margin-bottom: 20px; /*模块之前有间隔*/
}
 
 
.home .graph {
  display: flex; /*对于一行会自动弹性布局*/
  justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
}
 
.home .graph .el-card {
  width: 49%;
  margin-top: 20px; /*模块之前有间隔*/
}
</style>

