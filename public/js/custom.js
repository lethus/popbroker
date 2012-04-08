(function($){
	$(document).ready(function(){      
	  	$('.money').priceFormat({
			prefix: '',
			thousandsSeparator: '.',
			centsSeparator: ',',
			allowNegative: true
		});
	});
})(jQuery);
