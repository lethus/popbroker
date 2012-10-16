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
			// evento chama o grafico de rentabilidade da carteira
			createChart();
		});

		$(".close").click(function() {
		 	closeUpdate();
			setSelectedFilter("dados");
		});

		$(".dados").click(function() {
			closeUpdate();
			setSelectedFilter("dados");
		});
		
		// evento de clique na linha da tabela para abrir os detalhes do mês
		window.onload = rowHandlers;
		
		
		/* TESTE DE DADOS DO CHART */
		var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'records_chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2010'
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                ]
            }]
        });
        /* TESTE DE DADOS DO CHART */
    });
    
    function rowHandlers() {
		var table = document.all.dataTable;
	  	var row_count = table.rows.length;
	  	for (i=0; i<row_count; i++) {
	  		var currentRow = table.rows[i];
	  		currentRow.onclick = function(myrow) {
	  			return function() {
	  				remRow();
	  				var year = myrow.cells[0].innerHTML;
	  				var month = myrow.cells[1].innerHTML;
	  				addRow(myrow.rowIndex+1, year, month);
	  			};
	  		}(currentRow);
	  	}
    }
    
    function remRow() {
    	// função que remove as linhas antes de adicionar uma nova linha de detalhe
    	var table = document.all.dataTable;
    	var row_count = table.rows.length;
    	for (i=0; i<row_count; i++) {
    		if (table.rows[i].className == "detail-row") {
    			table.deleteRow(i);
    			row_count --;
    		}
    	}
    }
    
    function addRow(position, year, month) {
    	// função que adiciona uma linha na tabela de rentabilidade
    	
    	//criando a linha
    	var table = document.all.dataTable;
    	var row = table.insertRow(position);
    	row.className = "detail-row";
    	var cell = row.insertCell(0);
    	cell.colSpan = "9";
    	
    	// criando o titulo
    	var title = document.createElement("h2");
    	title.innerHTML = "detalhando lançamentos:";
    	cell.appendChild(title);
    	
    	$.ajax({
                url: 'http://localhost:3000/detail_month/?year=' + year +
                '&month='+ month,
                dataType: "jsonp",
                jsonpCallback: "_getValues",
                cache: false,
                timeout: 5000,
                success: function(data) {
                	for (i=0; i<data.length; i++) {
                		var reg = data[i];
                		var a = document.createElement("div");
                		a.href = "http://localhost:3000/exclude";
                		var p = document.createElement("p");
                		p.innerHTML = reg.type;
                		var span = document.createElement("span");
                		span.innerHTML = reg.wallet;
                		a.appendChild(p);
                		a.appendChild(span);
                		cell.appendChild(a);
                	}
                	
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
					renderTo : 'container_graph',
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
