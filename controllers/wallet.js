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
var modelUser = require('../models.js');
var formWallet = require('../forms/wallet.js');
var forms = require('../forms.js');
var utils = require('../utils.js');
var Wallet = modelWallet.Wallet;
var User = modelUser.User;

exports.add_routes = function (app) {
	app.get('/home', loadGlobals, function (req, res) {
    	res.render('wallet/home');
    });
    
    app.post('/home', loadGlobals, formWallet.addWalletForm, 
    function (req, res) {
    	if (req.form.isValid) {
    		
    		var o = new Wallet;
    		o.user = req.session.user._id;
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
