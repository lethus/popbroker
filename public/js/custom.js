(function($){
	$(document).ready(function(){      
	  $('.money').priceFormat({
			prefix: '',
			thousandsSeparator: ',',
			allowNegative: true
		});
	});
})(jQuery);
