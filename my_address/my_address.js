const app = getApp();
Page({
  data: {
    webImg: app.globalData.webImg,
    historyList: [],
  },
  onLoad: function(options) {
    var that = this;
    that.http();
  },
  goIncrease: function() {
    wx.navigateTo({
      url: '/pages/index/modular/user/user/increase_address/increase_address',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  goModify: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var str = JSON.stringify(that.data.historyList[index])
    wx.navigateTo({
      url: '/pages/index/modular/user/user/modify_address/modify_address?str=' + str,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  touchstart(e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      Mstart: e.changedTouches[0].pageX
    });
  },
  touchmove(e) {
    var history = this.data.historyList;
    var move = this.data.Mstart - e.changedTouches[0].pageX;
    history[this.data.index].x = move > 0 ? -move : 0;
    this.setData({
      historyList: history
    });
  },
  touchend(e) {
    var history = this.data.historyList;
    var move = this.data.Mstart - e.changedTouches[0].pageX;
    history[this.data.index].x = move > 100 ? -180 : 0;
    this.setData({
      historyList: history
    });
  },
  //删除某一条
  del(e) {
    var that = this;
    console
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#DD4F43',
      success(res) {
        if (res.tapIndex == 0) {
          wx.showLoading({
            title: '删除地址',
            mask: true
          })
          var index = e.currentTarget.dataset.index;
          var history = that.data.historyList;
          var addressId = history[index].addressId;
          that.delte(addressId, index);
        }
      }
    });
  },

  delte: function(addressId, index) {
    var that = this;
    var user = wx.getStorageSync('user');
    var history = that.data.historyList;
    wx.request({
      url: app.globalData.weburl + '/asuser/deleteaddress',
      header: {
        token: app.token
      },
      data: {
        address_id: addressId,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.state == 1) {
          history.splice(index, 1);
          that.setData({
            historyList: history
          });
        }
      },
      fail: function(res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '请求失败,请稍后再试。',
          showCancel: false
        })
      },
      complete: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 0)
      },
    })
  },

  http: function() {
    var that = this;
    var user = wx.getStorageSync('user');
    wx.request({
      url: app.globalData.weburl + '/asuser/queryaddress',
      header: {
        token: app.token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.msg==='请求成功！'){
          var historyList = res.data.data.asUserAddresss;
          that.setData({
            historyList: historyList
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
       
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '请求失败,请稍后再试。',
          showCancel: false
        })
        
      },
      complete: function(res) {},
    })
  },

  //用户点击确定按钮返回
  getBackData: function() {
    var that = this;
    that.http();
  },

  onShareAppMessage: function() {

  }
})