const { userService } = require('../../services/index')
Page({
  data: {
    tplbtns: [{ zh_CN: '投保人', en: 'applicant' }, { zh_CN: '被保险人', en: 'insured' }],
    selected: 'add-insured',
    applicant: { type: '企业' },
    placeholder: { name: '名称', id: '执照编号' }
  },

  changeApplicantType (e) {
    if (e.detail.value) {
      this.setData({ applicant: { type: '企业' }, placeholder: { name: '名称', id: '执照编号' } })
    } else {
      this.setData({ applicant: { type: '个人' }, placeholder: { name: '姓名', id: '身份证号' } })
    }
  },

  submitForm (e) {
    console.log(e)
    this.setData({ selected: '' })
  },

  add (e) {
    console.log(e.currentTarget.dataset.controller)
  },

  addInsured () {

  },

  addCargo () {

  },

  addConveyance () {

  },

  addVoyage () {

  },

  onLoad () {
    userService.validateUser().then(result => {
      if (!result) {
        wx.navigateTo({ url: '../login/login' })
      }
    })
  }
})
