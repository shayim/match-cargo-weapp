const {
  userService
} = require('../../services/index')
var app = getApp()

Page({
  data: {
    title: {
      en: 'Preset Information',
      zh_CN: '添加常用信息'
    },

    tpls: [{
      name: {
        en: 'Applicant',
        zh_CN: '投保人'
      }
    }, {
      name: {
        en: 'Insured',
        zh_CN: '被保险人'
      }
    }, {
      name: {
        en: 'Cargo',
        zh_CN: '被保货物'
      }
    }, {
      name: {
        en: 'Conveyance',
        zh_CN: '运输方式'
      }
    }, {
      name: {
        en: 'Voyage',
        zh_CN: '运输航线'
      }
    }],
    lang: (app.systemInfo && app.systemInfo.language) || 'zh_CN'
  },

  chooseTpl (e) {
    var tpl = e.currentTarget.dataset.tpl[0].toLowerCase() + e.currentTarget.dataset.tpl.substr(1)
    wx.navigateTo({
      url: `../${tpl}/${tpl}`
    })
  },

  onLoad () {
    userService.validateUser().then(result => {
      if (!result) {
        wx.navigateTo({
          url: '../login/login'
        })
      }
    })
  }
})
