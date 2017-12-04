$(function(){
  $('tbody > tr').click(function() {
    var id = $(this).attr('class');
    $(this).siblings('.'+id).toggle();
  });

  $('.event-icon').click(function(e) {
  var $el = $(e.currentTarget);
  $.ajax({
    url: '/api/events/' + $el.data('id') + '/favorite',
    method: 'POST',
    dataType: 'json',
    success: function(data) {
      // $('.event-icon').hide();
    },
    error: function(data, status) {
      if (data.status == 401) {
        alert('Login required!');
        location = '/';
      }
    }
  });
});
});
