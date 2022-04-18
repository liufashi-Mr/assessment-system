<template>
  <el-table height="600" :data="list" style="width: 100%;padding-top: 15px;cursor: pointer;" @click.native="$router.push('/allCheck/index')">
    <el-table-column label="审核奖项名称">
      <template slot-scope="scope">
        {{ scope.row.rewardName  }}
      </template>
    </el-table-column>
    <el-table-column label="申请人" align="center">
      <template slot-scope="scope">
        {{ scope.row.studentName}}
      </template>
    </el-table-column>
    <el-table-column label="申请状态" align="center">
      <template slot-scope="{row}">
         <el-tag v-if="row.applyStatus === -2" type="danger">
                不通过
              </el-tag>
              <el-tag v-if="row.applyStatus === 0" type="danger">
                已驳回
              </el-tag>
              <el-tag v-if="row.applyStatus === 1" type="primary">
                审核中
              </el-tag>
              <el-tag v-if="row.applyStatus === 2" type="success">
                已通过
              </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props:{
    list:{
      type:Array,
      default:()=>[],
    }
  },
}
</script>
