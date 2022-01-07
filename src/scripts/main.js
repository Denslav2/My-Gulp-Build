$(function () {
    $('.gallery__item-bootom a').click(function(event) {
        if($('.gallery__item-top img').attr('src')!==$(this).attr('href')){ 
        $('.gallery__item-top img').hide().attr('src', $(this).attr('href')).fadeIn(1000);
        }
      event.preventDefault();  
    })
})