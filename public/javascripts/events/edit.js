$(function(){
  // $('.location_map').click(function(){
  //   $('.location_map').css('display','none');
  //   $('#map').css('display','block');
  // })

  $('.btn-free').click(function(){
    $('.event-price-button > .btn-free').css('display', 'none');
    $('.event-price-button > .btn-paid').css('display', 'inline');
    $('.table').css('diaplay', 'inline');
    $('#paid-table').css('diaplay', 'none');
    // $('.event-price-button').append($('#free-form').html());
    var windowWidth = $(window).width();
    if(windowWidth < 768){
      $('.free_ticket_name').attr("placeholder","Ticket name");
      $('.free_ticket_num').attr("placeholder", "Quantity available");
    }
  })

  $('.btn-paid').click(function(){
    $('.event-price-button > .btn-paid').css('display', 'none');
    $('.event-price-button > .btn-free').css('display', 'inline');
    $('#paid-table').css('diaplay', 'inline');
    $('#free-table').css('diaplay', 'none');
    // $('.event-price-button').append($('#paid-form').html());
    var window_width = $(window).width();
    if(window_width < 768) {
      $('.paid_ticket_name').attr("placeholder", "Ticket name");
      $('.paid_ticket_num').attr("placeholder", "Quantity available");
      $('.paid_ticket_price').attr("placeholder", "Price");
    }

  })

  // function submitEvent(option){
  //   var title = $('#title').val();
  //   var location = $('#location').val();
  //   var starts = $('#starts').val();
  //   var start_time = $('#start_time').val(); //am과 pm
  //   var ends = $('#ends').val();
  //   var end_time = $('#end_time').val();
  //   var description = $('#mytextarea').val();
  //   var organizer = $('#organizer').val();
  //   var organizer_description = $('#organizer_description').val();
  //   // var start_am = $('#start_am').val();
  //   // var start_pm = $('#start_pm').val();
  //   // var end_am = $('#end_am').val();
  //   // var end_pm = $('#end_pm').val();
  //
  //   if(option=='add'){
  //     if(title=''||location==''||starts==''||start_time=''||ends=''||end_time=''||description=''||organizer=''||organizer_description=''){
  //       alert("내용을 모두 입력해주세요");
  //       return;
  //     } else {
  //       $('#createEvent').submit();
  //     }
  //   }
  // }

});
