// pages/yun/yun.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add: 0, //定时器的运行次数
    select: 0, //0用来选择服务器栏目，1作业
    beishu: 30, //每多少次算一秒
    time: 0, //时间，多少ms
    stop: 1,
    server: [],
    work_old: [],
    work_sort: [], //作业排队
    work_do: [], //正在执行的作业
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;
    var beishu = that.data.beishu


    setInterval(
      function() {
        that.time()
      }

      , 1000 / beishu
    );


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //设置顶部选择栏
  select: function(event) {
    var i = event.currentTarget.dataset.i;
    i = parseInt(i); //转化为整数
    this.setData({
      select: i
    })


  },
  submit: function(e) {
    var server_i = e.detail.value.first;
    var nut_i = e.detail.value.second;
    var server = this.data.server;
    var i = server.length;

    for (var j = server_i; j--; j > 0) {
      var n = 0;
      server[i] = {
        order: 1,
        nutnum: 3,
        nut: [],
        over: 0
      };
      server[i].order = i + 1;
      server[i].nutnum = nut_i;
      for (var k = nut_i; k--; k > 0) {
        server[i].nut[n] = {
          order: 1,
          olds: [],
          news: [],
          over: 0
        };
        server[i].nut[n].order = n + 1;
        server[i].nut[n].olds = [];
        server[i].nut[n].news = [];
        n++;

      }
      i = i + 1;

    }
    console.log(server)
    this.setData({
      server: server
    })
  },
  stop: function() {
    var stop = this.data.stop;
    stop = !stop;
    this.setData({
      stop: stop
    })
  },
  submit_work: function(e) {
    var stop=this.data.stop;
    this.setData({
      stop:1
    })
    var num = e.detail.value.first;

    var time = e.detail.value.second;
    var work = this.data.work_sort;
    var work_old=this.data.work_old;
    var work_do=this.data.work_do;
    var n = work.length + work_old.length + work_do.length;
    var m=work.length;
    for (var i = num; i > 0; i--) {
      work[m] = {
        order: 1,
        time: 1000,
        over: 0
      };
      work[m].order = parseInt(n)+ parseInt(i);
      work[m].time = time * 1000;
      work[m].over = 0;
     m++;
    }
    this.sort(work); //排序
    this.setData({
      stop: stop
    })
  },
  //定时处理的程序
  time: function() {
    var that = this;
    var beishu = that.data.beishu;
    var stop = that.data.stop;
    var time = that.data.time;
    var work_do = that.data.work_do;
    var work_sort = that.data.work_sort;
    var work_old = that.data.work_old;
    var server=that.data.server;
    var work_do_i = [];
    var add = that.data.add;

    if (stop == 0) {
      var i = work_do.length;
      //对作业的时间进行增加
      for (; i >0; i--) {
        work_do[i - 1].over += 1000 * 100 / (beishu * work_do[i - 1].time);
        //对已经完成的作业进行设置
        if (work_do[i - 1].over >= 100) {
          
          var server_id = work_do[i - 1].server_id;
          var nut_id = work_do[i - 1].nut_id;

          //设置相应的服务器

          var server_num = server.length;
         
          server[server_id - 1].nut[nut_id - 1].olds[server[server_id - 1].nut[nut_id - 1].olds.length] = work_do[i - 1].order;
          
          server[server_id - 1].nut[nut_id - 1].news.splice(0, 1);
         
          if (work_sort.length != 0) {
            server[server_id - 1].nut[nut_id - 1].news[0] = work_sort[0].order;
            work_sort[0].server_id = server[server_id - 1].order;
            work_sort[0].nut_id = server[server_id - 1].nut[nut_id - 1].order;
            work_do[work_do.length] = work_sort[0];
            work_sort.splice(0, 1);
          } else {
            
            server[server_id - 1].nut[nut_id - 1].over = 0;
            var check = 0;
            for (var t = server[server_id - 1].nut.length - 1; t >= 0; t--) {
              if (server[server_id - 1].nut[t].over == 0)
                check++;

            }
            if (check == server[server_id - 1].nut.length)
            {
              var check_s=0;
              server[server_id - 1].over = 0;
              for (var j = server.length-1;j>=0;j--)
              {
                if (server[server_id - 1].over==0)
                check_s+=1;
                

              }
              console.log(work_do)
              if (check_s == server.length&&work_do.length==1)
              {
                that.setData({
                  stop:!stop
                })
              }
            }
              
          }


          work_old[work_old.length] = work_do[i - 1];

          work_do.splice(i - 1, 1);

        }
      }
      
     //对还没有分配任务的服务器进行分配任务
      var check_1 = 0;
      
    for(var f=server.length-1;f>=0;f--)
    {
     
      
      if(server[f].over==0)
      {

      for(var g=server[f].nut.length-1;g>=0;g--)
      {
        if(server[f].nut[g].over==0)
        {
          
          if (work_sort.length != 0) {
            work_sort[0].server_id = server[f].order;
            work_sort[0].nut_id = server[f].nut[g].order;
            server[f].nut[g].news[0] = work_sort[0].order;
            work_do[work_do.length] = work_sort[0];
            work_sort.splice(0, 1);
            server[f].nut[g].over =1;
            server[f].over=1;
          }
        }
      }
      }

    }
    


      //判断是否已经1秒
      add += 1;
      if (add == beishu) {
        time += 1000;
        add = 0;
      }

    }
    that.setData({
      work_sort: work_sort,
      work_old: work_old,
      work_do: work_do,
      time: time,
      add: add,
      server: server
    })

  },
  //排序作业
  sort: function(work) {

   
    var n = work.length;
    var max,max_i;

    for (var i = 0; i < n; i++) {

      max = work[i];
      max_i=i;
      for (var j = i + 1; j < n; j++) {
        if (max.time < work[j].time && work[j].over < 100) {
          max_i = j;
          max = work[j];
        }
      }
      work[max_i] = work[i];
      work[i] = max;
      
      
    }
    this.setData({
      work_sort: work
    })


  }
})