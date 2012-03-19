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

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/popbroker');

exports.add_routes = function (app) {
	app.get('/home', loadGlobals, function (req, res) {

		var map = function() {
			var out = {};
			out[this.month] = {
			    'wallet': this.wallet,
				'inflow': this.inflow
			};
			
			emit(this.year, out);
		};

		var reduce = function(key, values) {
			var out = {};
			var valuesSize = values.length;
			for (var i=0; i<valuesSize;i++) {
				var p = values[i];
				for (var j in p) {
					if (!out[j]) {
						out[j] = {'wallet':0, 'inflow':0};
					}
					out[j]['wallet'] += p[j]['wallet'];
					out[j]['inflow'] += p[j]['inflow'];
				}
			}
			
			return out;
		}

		var command = {
			mapreduce: 'wallets',
			map: map.toString(),
			reduce: reduce.toString(),
			sort: {},
			query: {'user': mongoose.Types.ObjectId(req.session.user) },
			out:{'inline':1}
		};

		mongoose.connection.db.executeDbCommand(command, function(err, dbres) {
			if (err) throw err;
			res.render('wallet/home', {
					cursor: dbres.documents[0].results
				});
		});
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
