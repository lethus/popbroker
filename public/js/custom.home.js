(function($){
	$(document).ready(function(){
      $("#type").change(function () {
        pullWallet();
      })
      
      $("#month").change(function () {
        pullWallet();
      })
      
      $("#year").change(function () {
        pullWallet();
      })
    });
    
    
    
    function pullWallet() {
          var year = $("#year").val();
          var month = "";
          var type = "";
          
          $("#month option:selected").each(function () {
            month = $(this).val();
          });
              
          $("#type option:selected").each(function () {
            type = $(this).val();
          });
          
          if (year.length && month.length && type.length) {
              $.ajax({
                url: 'http://localhost:3000/pullwallet/?year=' + year +
                '&month='+ month +'&type='+ type,
                dataType: "jsonp",
                jsonpCallback: "_getValues",
                cache: false,
                timeout: 5000,
                success: function(data) {
                	if (data.inflow != 0)
                    	$('#inflow').attr('value', data.inflow);
                	if (data.wallet != 0)
                    	$('#wallet').attr('value', data.wallet);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert('Ocorreu um error ao pegar informações do banco!: ' + 
                      textStatus + ' ' + errorThrown );
                }
            });
          }     
    }
})(jQuery);
