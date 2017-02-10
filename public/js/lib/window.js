;(function () {
  $(window).resize(function () {
    resizeWindow();
  });
  resizeWindow();

  function resizeWindow() {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var left = $("#left");
    var mid = $("#mid");
    var right = $("#right");
    var right_list = $("#message-list");

    left.height(winHeight - 4 + "px");

    mid.css({
      width: winWidth - 50 - 350 - 10 + "px",
      height: winHeight
    });

    right.height(winHeight + "px");
    right_list.height(winHeight - 128+ "px");
  };

  //nice Scroll
  $("#message-list").niceScroll({
    cursorcolor: "#cc0033",
    cursoropacitymin: 0,
    cursoropacitymax: 0.5,
    railoffset: {
      top: -2,
      left: -2
    },
    cursorwidth: 3
  });

  $("#mid").niceScroll({
    cursorcolor: "#cc0033",
    cursoropacitymin: 0,
    cursoropacitymax: 0.5,
    cursorwidth: 5,
    autohidemode: "leave"
  });

  var showTime = $("#show-time input");
  window.display = true;


  $("#show-time").on('click', function () {
    if(showTime.is(':checked')){
      showTime.removeAttr('checked');
      $(".messageTime").fadeOut();
      display = false;
      // console.log(false);
    }else{
      showTime.attr('checked','checked');
      $(".messageTime").fadeIn();
      display = true;
      // console.log(true);
    }
  });


})();
