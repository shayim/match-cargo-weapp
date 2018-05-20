const applicantService = require('../../services/applicantService')
const app = getApp()

Page({

  data: {
    lang: (app.systemInfo && app.systemInfo.language) || 'zh_CN',
    title: {
      zh_CN: '投保人信息',
      en: 'Applicant Information'
    },
    subTitle: {
      zh_CN: '投保人承担保险费支付之义务',
      en: 'Applicant is liable to pay the premium'
    },
    type: {
      company: {
        zh_CN: '公司',
        en: 'Company'
      },
      person: {
        zh_CN: '个人',
        en: 'Individual'
      }
    },
    placeholder: {
      company: {
        name: {
          zh_CN: '请输入公司名称',
          en: 'Please input Company Name'
        },
        id: {
          zh_CN: '请输入营业执照号',
          en: 'Please input Company\'s License No'
        }
      },
      person: {
        name: {
          zh_CN: '姓名',
          en: 'Name'
        },
        id: {
          zh_CN: '身份证号',
          en: 'ID No'
        }
      }
    },
    applicant: {type: 'company'}
  },

  changeType: function (e) {
    var applicant = this.data.applicant
    if (e.detail.value) {
      applicant = Object.assign(applicant, {type: 'company'})
      this.setData({'applicant': applicant})
    } else {
      applicant = Object.assign(applicant, {type: 'person'})
      this.setData({'applicant': applicant})
    }
  },

  submitForm (e) {
    console.log(e.detail.value)
  },

  onLoad () {
    applicantService.getAll().then()
  }
})
