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
	
	
	app.get('/home', loadGlobals, function (req, res) {
		var cursor;
		var command = modelWallet.getWallets(req.session.user);
		mongoose.connection.db.executeDbCommand(command, function(err, dbres) {
			if (err) throw err;
			res.render('wallet/home', {
					cursor: calcProfit(dbres.documents[0].results)
				});
		});
		
		function calcProfit(dbres) {
			var wallet = 0,
				prev_shares = 0, 
				prev_shares_price = 0, 
				shares = 0, 
				shares_price = 0,
				year_shares_price = 0;
				start_shares_price = 0;
								
			for (var i=0; i<dbres.length; i++) {
				var db = dbres[i];
				for (var k in db.value) {
					var p = db.value[k];
					
					if (typeof p == 'undefined') {
						if (prev_shares != 0) {
							p = {
								'wallet': wallet,
								'inflow': 0,
								'shares': prev_shares.toFixed(3),
								'shares_price': prev_shares_price.toFixed(4),
								'perc_month': 0,
								'perc_year': 0,
								'perc_all': 0
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
						
						p.wallet = p.wallet.toFixed(2);
						p.inflow = p.inflow.toFixed(2);
						p.shares = shares.toFixed(3);
						p.shares_price = shares_price.toFixed(4);
						} else {
							wallet = p.wallet;
							shares = (p.inflow/prev_shares_price) + prev_shares;
							shares_price = p.wallet / shares;
						
							p.wallet = p.wallet.toFixed(2);
							p.inflow = p.inflow.toFixed(2);
							p.shares = shares.toFixed(3);
							p.shares_price = shares_price.toFixed(4);
							p.perc_month = 
								(((shares_price - prev_shares_price) / prev_shares_price) * 100)
								.toFixed(2);
							p.perc_year =
								(((shares_price - year_shares_price) / year_shares_price) * 100)
								.toFixed(2);
							p.perc_all = 
								(((shares_price - start_shares_price) / start_shares_price) * 100)
								.toFixed(2);
						}
					
						prev_shares = shares;
						prev_shares_price = shares_price;
					}

					if (typeof p != 'undefined')
						db.value[k] = p;
				}
				year_shares_price = prev_shares_price;
			}
						
			return dbres;
		};
		
		
		
		
    });

    app.post('/home', loadGlobals, formWallet.addWalletForm,
    function (req, res) {
    	if (req.form.isValid) {
    				
			var o = new Wallet;
    		o.user = req.session.user;
    		o.year = req.form.year;
    		o.month = req.form.month;
    		o.type = req.form.type;
    		o.wallet = req.form.wallet;
    		o.inflow = req.form.inflow;
    		o.save();

    		res.redirect('back');
    	}
    	else {
    		req.session.errors = _.union(
    			req.session.errors||[],
    			req.form.errors);

			res.redirect('back');
    	}
    });
};
