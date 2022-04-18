<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    // chartData:{
    //   type: Array,
    //   default:()=>[]
    // }
  },
  data() {
    return {
      chart: null,
      chartData:null
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.initChart()
  //   })
  // },
  watch:{
    chartData:{
     deep:true,
      handler(newVal, oldVal) {
       this.initChart(newVal)
      },
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(newVal) {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log(newVal)
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '20',
        },
        series: [
          {
            name: '',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 75],
            center: ['50%', '38%'],
            data: newVal,
            animationEasing: 'cubicInOut',
            animationDuration: 600
          }
        ]
      })
    }
  }
}
</script>
