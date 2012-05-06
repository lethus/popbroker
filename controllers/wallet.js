/*
 *  Copyright (C) 2011-2012 Lethus tecnologia da informação
 *      <www.lethus.com.br>
 *
 *   Damon Abdiel <damon.abdiel@gmail.com>
 *   Wilson Pinto Júnior <wilsonpjunior@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var _ = require('underscore');
var modelWallet = require('../models/wallet.js');
var modelUser = require('../models/users.js');
var formWallet = require('../forms/wallet.js');
var Wallet = modelWallet.Wallet;
var User = modelUser.User;

var mongoose = require('mongoose')
	, mongoTypes = require('mongoose-types');
	
mongoose.connect('mongodb://localhost/popbroker');
			 
exports.add_routes = function (app) {

	app.get('/pullwallet', loadGlobals, function (req, res) {
		Wallet.findOne({user: mongoose.Types.ObjectId(req.session.user),
			year: req.query.year, month: req.query.month, 
			type: req.query.type}, function(error, wallet) {
				res.writeHead(200, {'Content-Type': 'text/plain'});
				if (wallet) {
					res.end('_getValues({inflow: '+ wallet.inflow +
							', wallet: '+ wallet.wallet +'})');
				}
				else {
					res.end('_getValues({inflow: 0, wallet: 0})');
				}
				
			});
	});
	
	app.get('/graph', loadGlobals, function (req, res) {
		var cursor;
		var type = req.query["type"];
		var command = modelWallet.getWallets(req.session.user, type);
		mongoose.connection.db.executeDbCommand(command, function(err, dbres) {
			if (err) throw err;
			cursor: calcProfit(dbres.documents[0].results);
			arr = calcGraph(dbres.documents[0].results);
			res.end(JSON.stringify(arr));
				
		});
	});
	
	app.get('/home', loadGlobals, function (req, res) {
		var cursor;
		var type = req.query["type"];
		var command = modelWallet.getWallets(req.session.user, type);
		mongoose.connection.db.executeDbCommand(command, function(err, dbres) {
			if (err) throw err;
			res.render('wallet/home', {
				type: type,
				cursor: calcProfit(dbres.documents[0].results),
				graph: calcGraph(dbres.documents[0].results),
			});
		});
    });
    
    function calcGraph(dbres) {
       	arr_month = [];
       	arr_year = [];
       	arr_all = [];
       	arr = [];
       	for (var i=0; i<dbres.length; i++) {
       		var db = dbres[i];
       		
       		var last = 0; // variavel para salvar o ultimo mes salvo no banco para o ano em loop
			for (last in db.value) {} // varrendo registro do array de objetos para saber qual o ultimo mes salvo
			
			for (var k=1; k<=12; k++) {
				if (k <= last || i < (dbres.length -1)) {
					var p = db.value[k];
					
						if (typeof p != 'undefined') {
							item_m = [], item_y = [], item_a = [];
							data = new Date(db._id, k, 1);
							
							item_m[0] = new Number(data);
							item_m[1] = new Number(p.perc_month.toString()
								.replace(",","."));
							arr_month.push(item_m);
							
							item_y[0] = new Number(data);
							item_y[1] = new Number(p.perc_year.toString()
								.replace(",","."));
							arr_year.push(item_y);
							
							item_a[0] = new Number(data);
							item_a[1] = new Number(p.perc_all.toString()
								.replace(",","."));
							arr_all.push(item_a);
						}
				}
			}
       	}
       	
       	arr[0] = { data: arr_month, name: "Mes", marker: { enabled: true, radius: 3}, shadow: true };
       	arr[1] = { data: arr_year, name: "Ano", marker: { enabled: true, radius: 3}, shadow: true };
       	arr[2] = { data: arr_all, name: "Historico", marker: { enabled: true, radius: 3}, shadow: true };
       	return arr;
    }
    
    function calcProfit(dbres) {
			Number.prototype.formatMoney = function(c){
				var d = ",", t = ".";
				var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
				return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
			};

			var wallet = 0,
				prev_shares = 0, 
				prev_shares_price = 0, 
				prev_perc_year = 0,
				prev_perc_all = 0,
				shares = 0, 
				shares_price = 0,
				year_shares_price = 0,
				start_shares_price = 0;
								
			for (var i=0; i<dbres.length; i++) {
				var db = dbres[i];
				
				var last = 0; // variavel para salvar o ultimo mes salvo no banco para o ano em loop
				for (last in db.value) {} // varrendo registro do array de objetos para saber qual o ultimo mes salvo
				
				for (var k=1; k<=12; k++) {
					if (k <= last || i < (dbres.length -1)) {
						
						var p = db.value[k];
					
						if (typeof p == 'undefined') {
							if (prev_shares != 0) {
								p = {
									'wallet': wallet.formatMoney(2),
									'inflow': Number("0").formatMoney(2),
									'shares': prev_shares.formatMoney(3),
									'shares_price': prev_shares_price.formatMoney(4),
									'perc_month': Number("0").formatMoney(2),
									'perc_year': prev_perc_year,
									'perc_all': prev_perc_all
								}
							}
						}
						else {
							if (prev_shares == 0) {
							wallet = p.wallet;
							shares = p.wallet;
							shares_price = p.wallet / shares;
							year_shares_price = shares_price;
							start_shares_price = shares_price;
						
							p.wallet = p.wallet.formatMoney(2);
							p.inflow = p.inflow.formatMoney(2);
							p.shares = shares.formatMoney(3);
							p.shares_price = shares_price.formatMoney(4);
							} else {
								wallet = p.wallet;
								shares = (p.inflow/prev_shares_price) + prev_shares;
								shares_price = p.wallet / shares;
						
								p.wallet = p.wallet.formatMoney(2);
								p.inflow = p.inflow.formatMoney(2);
								p.shares = shares.formatMoney(3);
								p.shares_price = shares_price.formatMoney(4);
								
								p.perc_month = 
									(((shares_price - prev_shares_price) / prev_shares_price) * 100)
									.formatMoney(2);
								
								p.perc_year =
									(((shares_price - year_shares_price) / year_shares_price) * 100)
									.formatMoney(2);
								prev_perc_year = p.perc_year;
								
								p.perc_all = 
									(((shares_price - start_shares_price) / start_shares_price) * 100)
									.formatMoney(2);
								prev_perc_all = p.perc_all;
							}
					
							prev_shares = shares;
							prev_shares_price = shares_price;
						}

						if (typeof p != 'undefined')
							db.value[k] = p;
					}
				}
				year_shares_price = prev_shares_price;
			}
						
			return dbres;
		};

    app.post('/home', loadGlobals, formWallet.addWalletForm,
    function (req, res) {
    	if (req.form.isValid) {
			Wallet.findOne({user: mongoose.Types.ObjectId(req.session.user),
				year: req.form.year, month: req.form.month, 
				type: req.form.type}, function(error, wallet) {
				
				var o = new Wallet;
				if (wallet)
					o = wallet;
				
				o.user = req.session.user;
				o.year = req.form.year;
				o.month = req.form.month;
				o.type = req.form.type;
				o.wallet = req.form.wallet;
				o.inflow = req.form.inflow;
				o.save();

				res.redirect('back');
			});
    	}
    	else {
    		req.session.errors = _.union(
    			req.session.errors||[],
    			req.form.errors);

			res.redirect('back');
    	}
    });
};
