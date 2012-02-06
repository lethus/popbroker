// JavaScript Document

$(document).ready(function() {
	
			$('.notification').hover(function() {
 				$(this).css('cursor','pointer');
 			}, function() {
 					$(this).css('cursor','auto');
				});

			$('.notification span').click(function() {
                $(this).parents('.notification').fadeOut(800);
            });
			
			$('.notification').click(function() {
                $(this).fadeOut(800);
            });
		

});