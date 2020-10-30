var util = require('../../../../../../utils/util.js');
const app = getApp();
var jianti = require('./jianti.js');
var fanti = require('./fanti.js');
var QQMapWX = require('../../../../../../utils/qqmap-wx-jssdk');
var qqmapsdk;
Page({
  data: {
    webImg: app.globalData.webImg,
    ziti: jianti.content,
    integral: '0',
    testT:false,
    //联系地址
    addressInfo:'',
    //显示地址
    address:'',
    shibai:0,

  },
  onLoad: function (options) {
    //调用腾讯地图KEY
      qqmapsdk = new QQMapWX({
      key: 'DMTBZ-GL5L2-JQIUO-CHZDN-SCNU7-WFBIK'
    });

    if (wx.getStorageSync("CY") == "on") {
      this.setData({
        testT: true
      })
    }
    var that = this;
    var user = wx.getStorageSync('user');
    var setziti = wx.getStorageSync('ziti');
    var character = wx.getStorageSync('character');
    this.getCha();
    var ziti = jianti.content;
    if (setziti != true) {
      setziti = false;
      ziti = jianti.content
      wx.setNavigationBarTitle({
        title: '个人信息'
      })
    } else {
      ziti = fanti.content
      wx.setNavigationBarTitle({
        title: '個人信息'
      })
    }
    // that.http();
    that.setData({
      user: user,
      ziti: ziti,
      character: character
    })
  },
  onShow: function () {
    this.getCha();
    this.getMsgCount()
  },

  //获取短信未读条数
  getMsgCount(){
    wx.request({
      url:  app.globalData.weburl + '/user/msg/count',
      header: {
        token: app.token
      },
      data:{
        page:1,
        limit:50,
      },
      method: 'GET',
      success:(res)=>{
        console.log(res)
        if(res.data.code===0){
          this.setData({
            MsgCount:res.data.num
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      },
      fail:(res)=>{
        wx.showModal({
          title: '提示',
          content: '网络错误，请求失败',
          showCancel: false
        })
      }
    })
  },
  
  getCha() {
    wx.request({
      url: app.globalData.weburl + '/asuser/query',
      header: {
        token: app.token
      },
      method: 'post',
      success: (res) => {
        if (res.data.code === 0) {
          var character = res.data.user;
          wx.setStorageSync('character', character);
          this.setData({
            character: character
          })
          var character = wx.getStorageSync('character');
          let integral = character.integral;
          if (!integral) {
            this.setData({
              integral: '0'
            })
          } else {
            this.setData({
              integral: integral
            })
          }
        }
      },
      fail: (res) => {
        // this.setData({maintain:1})
      }
    })
  },
  http: function () {
    var that = this;
    var user = wx.getStorageSync('user');
    var characterdata = wx.getStorageSync('character');
    wx.request({
      url: app.globalData.weburl + '/asuser/query',
      header: { token: app.token },
      method: 'post',
      success: function (res) {
        console.log(res.data)
        var character = res.data.user;
        if (character.nickname = null) {
          character.nickname = characterdata.nickname
        }
        wx.setStorageSync('character', character);
        that.setData({
          character: character,
        })
      }
    })
  },
  goAttendance() {
    wx.navigateTo({
      url: '/packageA/pages/index/integral/Attendance/Attendance',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //上报当前位置
  goLocation(){
    if(this.data.shibai==0){
      const that = this
    wx.authorize({
        scope:'scope.userLocation',
        success () {
          //将获取坐标转化成文本
          qqmapsdk.reverseGeocoder({
            success:aa=>{
              //console.log(aa.result.address)
              that.setData({
                address:aa.result.address,
              }),
              wx.showModal({
                title: '当前位置',
                content: that.data.address,
                confirmText:'上报',
                success (res) {
                  if (res.confirm) {
                    //console.log('用户点击确定')
                  } else if (res.cancel) {
                    //console.log('用户点击取消')
                  }
                }
              })
            }
          })
        },
        fail:res=>{
          return(
            this.setData({
              shibai:1
            })
          )
        }
    })
    // console.log(this.data.shibai)
    }
    if(this.data.shibai==1){
      wx.openSetting({
        success:suc=>{
          // console.log(this)
          if(suc.authSetting["scope.userLocation"]){
            this.setData({
              shibai:0
            })
          }
        }
      })
    }
  },


  goSubscribe: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/subscribe/subscribe',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goCollection: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/collection/collection',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goQuiz: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/quiz/quiz',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goPhoto: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/up_photo/up_photo',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goName: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/modify_name/modify_name',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goEwm: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/ewm/ewm',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goMore: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/more/more',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  goZz: function () {
    wx.navigateTo({
      url: '/pages/index/modular/licence/my_ka/my_licence/my_licence',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  goPhone: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/phone/phone',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //联系地址
  goAddres: function () {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          addressInfo: res
        })
      },
    })
  },
  goInte() {
    // console.log('112',);

    wx.navigateTo({
      url: '/packageA/pages/index/integral/myScores/myScores',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goMmdifySign: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/modify_sign/modify_sign',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goMmdifySign: function () {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/modify_sign/modify_sign',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  


  goQuestion: function () {
    var user = wx.getStorageSync('user');
    wx.request({
      url: app.globalData.weburl + '/index/signout',
      header: {
        token: app.token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.clearStorageSync()
        wx.reLaunch({
          url: '/pages/index/index'
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //用户点击确定按钮返回
  getBackData: function () {
    var that = this;
    that.http();
  },

  //反馈记录
  goFeedback: function (e) {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/feedback_record/feedback_record',
    })
  },

  goMessage: function (e) {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/message/message',
    })
  },

  onShareAppMessage: function () {
    return {
      title: '分享',
      path: 'pages/index/modular/user/user/my/my'
    }
  },


});
