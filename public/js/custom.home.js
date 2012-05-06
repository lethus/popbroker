(function($){
	$('#page').live('pagecreate',function(event){
		var myselect = $("select#type");
		var type_selected = document.all.type_selected.value;
		switch (type_selected) {
			case "ac":
				myselect[0].selectedIndex = 1;
				break;
			case "cp":
				myselect[0].selectedIndex = 2;
				break;
			case "cd":
				myselect[0].selectedIndex = 3;
				break;
			case "db":
				myselect[0].selectedIndex = 4;
				break;
			case "dr":
				myselect[0].selectedIndex = 5;
				break;
			case "fa":
				myselect[0].selectedIndex = 6;
				break;
			case "fi":
				myselect[0].selectedIndex = 7;
				break;
			case "fr":
				myselect[0].selectedIndex = 8;
				break;
			case "im":
				myselect[0].selectedIndex = 9;
				break;
			case "me":
				myselect[0].selectedIndex = 10;
				break;
			case "ou":
				myselect[0].selectedIndex = 11;
				break;
			case "tp":
				myselect[0].selectedIndex = 12;
				break;
		}
	});

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
			closeUpdate();
			hideTableTiny();
			addWallet.style.display = "inline";
			setSelectedFilter("update");
		});

		$(".grafico").click(function() {
		  	closeUpdate();
		  	hideTableBig();
		  	viewGraph.style.display = "inline";
			setSelectedFilter("grafico");
		});

		$(".close").click(function() {
		 	closeUpdate();
			setSelectedFilter("dados");
		});

		$(".dados").click(function() {
			closeUpdate();
			setSelectedFilter("dados");
		});
		
		createChart();
		
    });
   
    function QueryString(variavel){
		var variaveis=location.search.replace(/\x3F/,"").replace(/\x2B/g," ").split("&")
		var nvar    
			 if(variaveis!=""){
			 var qs=[]
				for(var i=0;i<variaveis.length;i++){
				nvar=variaveis[i].split("=")
				qs[nvar[0]]=unescape(nvar[1])
				}
			return qs[variavel]
			}
		return "";
	}
    
    function createChart() {
		var type = QueryString("type");

		$.getJSON("http://localhost:3000/graph/?type=" + type.toString(), function(data) {
			// Create the chart
			window.chart = new Highcharts.StockChart({
				chart : {
					renderTo : 'container',
					width: 540
				},

				yAxis: {
		            labels: {
		                formatter: function() {
		                    return (this.value > 0 ? '+' : '') + this.value + '%';
		                }
		            },
		            plotLines: [{
		                value: 0,
		                width: 2,
		                color: 'silver'
		            }]
            	},
            	
            	tooltip: {
		            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} %</b><br/>',
		            valueDecimals: 2
            	},
		
				series : data
			});
		});
    	
    }
    
    function hideTableTiny() {
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

		table.width = "627px";
		addWallet.style.display = "none";
		viewGraph.style.display = "none";
	}
	
	function hideTableBig() {
		var table = document.all.dataTable;
	  	var addWallet = document.all.addWallet;
		var rowCount = table.rows.length;

		for(var i=0; i<rowCount; i++) {
			var row = table.rows[i];
			if (i!=0)
				row.cells[3].style.borderRight = "1px solid #DDD"
			row.cells[4].style.display = "none"; 
			row.cells[5].style.display = "none"; 
			row.cells[6].style.display = "none"; 
			row.cells[7].style.display = "none"; 
			row.cells[8].style.display = "none";               
		}

		table.width = "370px";
		addWallet.style.display = "none";
		viewGraph.style.display = "none";
	}
	
    function closeUpdate() {
		var table = document.all.dataTable;
		var addWallet = document.all.addWallet;
		var rowCount = table.rows.length;

		for(var i=0; i<rowCount; i++) {
			var row = table.rows[i];
			if (i!=0) {
				row.cells[3].style.borderRight = "none";
				row.cells[5].style.borderRight = "none";
			}
			row.cells[4].style.display = ""; 
			row.cells[5].style.display = ""; 
			row.cells[6].style.display = ""; 
			row.cells[7].style.display = ""; 
			row.cells[8].style.display = ""; 
		}

		table.width = "100%";
		addWallet.style.display = "none";
		viewGraph.style.display = "none";
    }
    
	function setSelectedFilter(option) {
		document.all.dados.className = "";
		document.all.grafico.className = "";
		document.all.ajuda.className = "";
		document.all.update.className = "";
		
		switch(option) {
			case "dados":
				document.all.dados.className = "selected";
				break;
			case "grafico":	
				document.all.grafico.className = "selected";
				break;
			case "ajuda":
				document.all.ajuda.className = "selected";
				break;
			case "update":
				document.all.update.className = "selected";
				break;
		}
	}
    
    
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
