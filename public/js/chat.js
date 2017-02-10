;$(document).ready(function () {
  var socket = io();

  var init = true;
  var user = getUserAgent();
  var outter = $("#message-list");
  var inner = $('#message-list-wrap');
  var moreMessage = $("#more-message");



  socket.on('connect', function () {
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
      if (err) {
        alert(err);
        window.location.href = '/';
      }
      // else{
      //   console.log(params.info.ip);
      //   console.log('No error!');
      // }
    });

  });


  moreMessage.on('click', function () {
    var scrollHeight = outter.prop('scrollHeight');
    moreMessage.fadeOut();
    outter.scrollTop(scrollHeight);
  });

  function scrollToBottom() {
    //selector
    var newMessage = inner.children('li:last-child');
    // Heights
    var clientHeight = outter.prop('clientHeight');
    var scrollTop = outter.prop('scrollTop');
    var scrollHeight = outter.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
      outter.scrollTop(scrollHeight);
      moreMessage.fadeOut();
      init = false;
    }else{
      if (!init) moreMessage.fadeIn();
    }

  }

  socket.on('newMessage', function (message) {
    var timeFormat = moment(message.createdAt).format('h:mm');
    //var template = $("#message-template").html();
    //var showIt = display ? '':'style=\"display:none\"';
    //console.log(showIt);
    // var html = Mustache.render(template, {
    //   from: message.from,
    //   message: message.text,
    //   time: timeFormat,
    //   showIt: showIt
    // });
    var li = $('<li></li>').addClass('message-line');
    var p = $('<p></p>');
    var span1 = $('<span></span>').addClass('messageTime');
    if (!display) span1.attr('style','display:none');
    var span2 = $('<span></span>').addClass('messageName');
    span1.html(timeFormat);
    p.append(span1);
    span2.html(message.from + " : ");
    p.append(span2);
    p.append(message.text);
    li.append(p);
    inner.append(li);

    console.log(inner.children('li').length);
    if(inner.children('li').length > 100){
      inner.children('li:first-child').remove();
    }

    outter.getNiceScroll().resize();
    scrollToBottom();
  });

  socket.on('disconnect', function () {
    console.log('Disconnect from server!');
  });

  socket.on('updateUserList', function (users) {
    var ul = $('<ul></ul>');
    users.forEach(function (user) {
      ul.append($('<li></li>').text(user));
    });
    $("#user-list").html(ul);
  });

  socket.on('showLocation', function (info) {

    var li = $('<li class="locations"></li>');
    var location = {"IP":info.ip, "City":info.city, "State":info.region_name, "Country":info.country_name};
    for(var i in location){
      li.append('<p>'+i+' : '+location[i]+'</p>');
    }
    inner.append(li);
    locationButton.removeAttr('disabled').text('Send Location');
    scrollToBottom();
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
      text: message.val()
    }, function () {
      message.val("").focus();
    });


    //console.log("message-list-height : ", outter.height());
    //console.log("message-list-wrap-height : ", inner.height() + " scroll : " + scroll);

  }
  //geolocation
  var locationButton = $('#send-location');
  locationButton.on('click', function () {
    locationButton.attr('disabled','disabled').text('Sendind Location...');
    $.getJSON('//freegeoip.net/json/?callback=', function (info){
      socket.emit('updateUser', info);
    });

  });


});
