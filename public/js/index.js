;$(document).ready(function () {
  var socket = io();

  var user = getUserAgent();
  var outter = $("#message-list");
  var inner = $('#message-list-wrap');
  console.log(user);
  socket.on('connect', function () {
    console.log('Connected to server!');
  });

  socket.on('newMessage', function (message) {
    var li = `<li class='message-line'><p>${message.from} : ${message.text}</p></li>`;
    inner.append(li);

    var li_count = $("#message-list-wrap li");
    console.log(li_count.length);
    if(li_count.length > 100){
      li_count.eq(0).remove();
    }

    $("#message-list").getNiceScroll().resize();
    outter.scrollTop(inner.height()-850+38);
  });

  socket.on('disconnect', function () {
    console.log('Disconnect from server!');
  });

  //form submition
  $('#send').on('click', function (e) {
    e.preventDefault();
    sendMessage();
  });

  $(window).on('keypress', function (event) {
    if (event.which === 13) {
      event.preventDefault();
      sendMessage();
    }
  });

  //get user agent
  function getUserAgent() {
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  }

  //send message
  function sendMessage() {
    var message = $("#message");
    if(message.val() === "") return;
    socket.emit('createMessage', {
      from: user,
      text: message.val()
    }, function (callback) {
      console.log(callback + "ok");
    });


    //console.log("message-list-height : ", outter.height());
    //console.log("message-list-wrap-height : ", inner.height() + " scroll : " + scroll);
    message.val("");
  }
  //geolocation
  var locationButton = $('#send-location');
  locationButton.on('click', function () {
    if (!navigator.geolocation){
      return alert('Geoloation is not supported in your browswr!');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function (e) {
      socket.emit('createMessage', {
        from: 'error',
        text: 'Unable to fatch location'
      }, function (callback) {
        console.log(callback);
      });
    });

  });


});
