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
var model = require("../models/wallet.js");

var form = require("express-form"),
	filter = form.filter,
	validate = form.validate;
	
var addWalletForm = form(
	filter("ano").trim(),
	validate("ano")
		.required(null, "Escolha um ano"),
		
	filter("mes").trim(),
	validate("mes")
		.required(null, "Escolha um mês")
);

exports.addWalletForm = addWalletForm;
