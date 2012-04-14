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
      
      $(".update").click(function() {
		  	var table = document.all.dataTable;
		  	var addWallet = document.all.addWallet;
			var rowCount = table.rows.length;
			
			for(var i=0; i<rowCount; i++) {
				var row = table.rows[i];
				if (i!=0)
					row.cells[5].style.borderRight = "1px solid #DDD"
		        row.cells[6].style.display = "none"; 
		        row.cells[7].style.display = "none"; 
		        row.cells[8].style.display = "none";               
			}
			
			table.width = "70%";
			addWallet.style.display = "inline"; 
			
			//$("#dataTable thead tr:first th:last").style = "none";
		});
		
	    $(".close").click(function() {
    		var table = document.all.dataTable;
		  	var addWallet = document.all.addWallet;
			var rowCount = table.rows.length;
			
			for(var i=0; i<rowCount; i++) {
				var row = table.rows[i];
				if (i!=0) 
					row.cells[5].style.borderRight = "none";
			    row.cells[6].style.display = ""; 
			    row.cells[7].style.display = ""; 
			    row.cells[8].style.display = ""; 
			}
			
			table.width = "100%";
			addWallet.style.display = "none"; 
    	});
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
