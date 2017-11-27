$(function(){
  $('tbody > tr').click(function() {
    var id = $(this).attr('class');
    $(this).siblings('.'+id).toggle();
  });
});
