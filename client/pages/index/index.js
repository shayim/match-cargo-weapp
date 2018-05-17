const {userService} = require('../../services/index')
Page({
  data: {
    selected: '',
    applicant: {type: '企业'},
    placeholder: {name: '名称', id: '执照编号'}
  },

  changeApplicantType (e) {
    if (e.detail.value) {
      this.setData({applicant: {type: '个人'}, placeholder: {name: '姓名', id: '身份证号'}})
    } else {
      this.setData({applicant: {type: '企业'}, placeholder: {name: '名称', id: '执照编号'}})
    }
  },

  submitForm (e) {
    console.log(e)
    this.setData({selected: ''})
  },

  addApplicant () {
    this.setData({selected: 'addApplicant'})
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
        wx.navigateTo({url: '../login/login'})
      }
    })
  }
})
