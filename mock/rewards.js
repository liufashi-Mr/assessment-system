const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: '17027@increment',
      timestamp: +Mock.Random.date('T'),
      name: '@cname',
      age: '@integer(20, 26)',
      'gender|1': ['男', '女'],
      'college|1': [
        '计算机与软件学院',
        '艺术学院',
        '信息与工程科学院',
        '社会科学学院',
        '人文学院'
      ],
      'applicationAwards|1': [
        '国家奖学金',
        '国家励志奖学金',
        '国家助学金',
        '十佳学生干部',
        '十佳大学生',
        '优秀大学',
        '优秀大学生干部',
        '三好学生',
        '优秀毕业生',
        '特殊贡献奖'
      ]
    })
  )
}

const jxList = []
const jxCount = 100

for (let i = 0; i < jxCount; i++) {
  jxList.push(
    Mock.mock({
      id: '@increment',
      'name|1': [
        '国家奖学金',
        '国家励志奖学金',
        '国家助学金',
        '十佳学生干部',
        '十佳大学生',
        '优秀大学',
        '优秀大学生干部',
        '三好学生',
        '优秀毕业生',
        '特殊贡献奖'
      ],
      mark: '这是一个描述字段',
      'time|1': [
        '第一学期~第二学期',
        '第一学期~第三学期',
        '第一学期~第四学期',
        '第二学期~第三学期',
        '第二学期~第四学期',
        '第三学期~第四学期'
      ],
      'college|1': [
        '计算机与软件学院',
        '艺术学院',
        '信息与工程科学院',
        '社会科学学院',
        '人文学院'
      ],
      'condition|1': ['无挂科', '优秀党员', '所有人', '计算机专业', '艺术生']
    })
  )
}

module.exports = [
  {
    url: '/vue-element-admin/rewards/apply/list',
    type: 'get',
    response: (config) => {
      const {
        importance,
        type,
        title,
        page = 1,
        limit = 10,
        sort
      } = config.query

      let mockList = List.filter((item) => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      )

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/rewards/reward/list',
    type: 'get',
    response: (config) => {
      const {
        importance,
        type,
        title,
        page = 1,
        limit = 10,
        sort
      } = config.query

      let mockList = jxList.filter((item) => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      )

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/rewards/apply/detail',
    type: 'get',
    response: (config) => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/rewards/apply/pv',
    type: 'get',
    response: (_) => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/rewards/apply/create',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/rewards/apply/update',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
