<template>
  <div style="margin: 10px" >
    <!--与上边距相差 20px的距离-->
    <el-row class="home" :gutter="20">
      <!--左边占据 8 -->
      <el-col :lg='{span:6}'>
        <!--上面个人信息-->
        <el-card shadow="hover" class="box-card" style="min-height:210px">
          <el-col :lg='{span:12}'>
            <img class="avatar" :src="avatar" alt="" />
          </el-col>
          <el-col :lg='{span:12}' style="font-size:13px">
            <p >用户名：{{ name }}</p>　
            <p>用户角色：{{ roleName }}</p>　
            <p>兴趣：code & game & food</p>
            <p>个性签名：暂无暂无暂无暂无暂无暂无</p>
          </el-col>
        </el-card>
        <!--下面信息框-->
        <el-card shadow="hover" style="min-height: 633px; margin-top: 20px">
         <TransactionTable v-if='messageCount&&messageCount.length' :list="messageCount"/>
        </el-card>
      </el-col>
      <!--右边占据16-->
      <el-col :lg='{span:18}' v-if="nums&&nums.length===6">
        <!--6个显示金额-->
        <div class="num">
          <el-card class="card-panel" shadow="hover" v-for="item in nums" :key="item.name" @click.native="$router.push('/'+item.link)">
            <el-col :lg='{span:12}'>
              <img class="icon-img" :src="item.icon"></img>
            </el-col>
            <el-col :lg='{span:12}'>
              <div class="detail" style="text-align:right">
                <p class="card-panel-text">{{item.name}}</p>
                <count-to :start-val="0" :end-val="item.value" :duration="3000" class="card-panel-num" />
              </div>
            </el-col>
          </el-card>
        </div>
        <!--显示流程图-->
        <el-card shadow="hover">
          <div style="min-height: 280px">
            <LineChart :chartData='chartData' />
          </div>
        </el-card>
        <!--左边最下面两个流程图-->
        <div class="graph">
          <el-card shadow="hover">
            <div style="min-height: 260px">
              <PieChart ref="PieChart_pie" />
            </div>
          </el-card>
          <el-card shadow="hover">
            <div style="min-height: 260px">
              <PieChart ref="PieChart_raddar" />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import getRoleName from '@/utils/getRoleName'
import { getToken } from '@/utils/auth'
import LineChart from '../admin/components/LineChart.vue'
import PieChart from '../admin/components/PieChart.vue'
import TransactionTable from '../admin/components/TransactionTable.vue'
import {
  getRewards,
  getApplyList,
  getRewardResult
} from "@/api/rewards";
import user from '@/store/modules/user'
import {
  getStudent,
} from "@/api/manage";
import CountTo from 'vue-count-to'
export default {
  data () {
    return {
      roleName: '',
      messageCount:null,
      nums: [],
      chartData: null,
      rewardsData:null
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles']),
  },
  components: {
    LineChart,
    PieChart,
    TransactionTable,
    CountTo
  },
  async mounted () {
    this.roleName = getRoleName(getToken())
    await this.getStudentList()
    await this.getRewardsList()
    await this.getMessageCount()
    await this.promiseRewardId()
  },
  methods: {
    async getStudentList () {
      let data = {
        collegeId: "",
        grade: "",
        majorId: "",
        studentName: "",
        studentNumber: "",
        typeId: ""
      }
      const { total } = await getStudent(data);
      const total_user = {
        name: '用户个数',
        value: total,
        icon: require('@/assets/home/user.png'),
        link: 'userManage/index'
      }
      this.nums.push(total_user)
    },
    async getRewardsList () {
      const { data, total } = await getRewards();
      const total_reward = {
        name: '奖项个数',
        value: total,
        icon: require('@/assets/home/graph-bar.png'),
        link: 'rewardsDeclare/rewardList'
      }
      this.rewardsData = data
      this.nums.push(total_reward)
    },
    async getMessageCount () {
      const { data } = await getApplyList({ role: getToken() });
      const total_apply = {
        name: '奖项申请人数',
        value: data.length,
        icon: require('@/assets/home/envelope.png'),
        link: 'rewardsDeclare/applyList'
      }
      this.messageCount = data
      const total_apply_ing_length = data.filter(item => item.applyStatus == 1)
      const total_apply_up_length = data.filter(item => item.applyStatus == 2)
      const total_apply_ret_length = data.filter(item => item.applyStatus == 0)
      const total_apply_out_length = data.filter(item => item.applyStatus == -2)
      const total_apply_ing = {
        name: '奖项审核中人数',
        value: total_apply_ing_length.length,
        icon: require('@/assets/home/clock.png'),
        link: 'allCheck/index'
      }
      const total_apply_up = {
        name: '奖项通过人数',
        value: total_apply_up_length.length,
        icon: require('@/assets/home/check.png'),
        link: 'allCheck/index'
      }
      const total_apply_out = {
        name: '奖项未通过人数',
        value: total_apply_out_length.length,
        icon: require('@/assets/home/close.png'),
        link: 'allCheck/index'
      }
      const total_apply_ret = {
        name: '奖项驳回人数',
        value: total_apply_ret_length.length,
        link: 'allCheck/index'
      }
      this.nums.push(total_apply, total_apply_ing, total_apply_up, total_apply_out)
      // 模拟数据
      let index = new Date().getDay()
      let expectedData = [3, 5, 6, 2, 1, 2, 0]
      expectedData[index - 1] = total_apply_up.value
      let actualData = [2, 3, 1, 2, 5, 5, 0]
      actualData[index - 1] = total_apply_out.value
      this.chartData = {
        expectedData,
        actualData
      }
      this.$nextTick(()=>{
        this.$refs.PieChart_pie.chartData = [
        total_apply_up,
        total_apply_out,
        total_apply_ing,
        total_apply_ret
      ]
      })
    },
    async promiseRewardId(){
       const rewardId = this.rewardsData.map(item => {
        return {
          name: item.rewardName,
          id: item.id
        }
      })
      const PromiseAll = rewardId.map(
        item => new Promise(resolve => {
          getRewardResult({ rewardId: item.id }).then(res => {
            resolve(res)
          }).catch(req => {
            // 处理promise all 异常
            return Promise.resolve(req)
          })
        })
      )
      let res = await Promise.all(PromiseAll)
      res.filter((item, index) => rewardId[index].value = item.data.length)
      this.$nextTick(()=>{
        this.$refs.PieChart_raddar.chartData = rewardId
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  .num {
    display: flex; /*对于一行会自动弹性布局*/
    flex-wrap: wrap; /*对于6个模块需要换行*/
    justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
    .el-card {
      width: 32%;
      margin-bottom: 20px; /*模块之前有间隔*/
    }
  }
  .graph {
    display: flex; /*对于一行会自动弹性布局*/
    justify-content: space-between; /*表示水平两端对齐，justify-content：水平对齐的方式*/
    .el-card {
      width: 49%;
      margin-top: 20px; /*模块之前有间隔*/
    }
  }
  .user {
    display: flex;
    align-content: center;
  }
  .avatar {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
  }
  p {
    // font-size: 16px;
    color: #5e6d82;
    line-height: 1.5em;
  }
  .icon-img {
    width: 80px;
    height: 75px;
  }
  .card-panel {
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    &-num {
      font-size: 20px;
    }
  }
}
</style>

