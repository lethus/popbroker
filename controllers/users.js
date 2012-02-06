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
var models = require('../models.js');
var forms = require('../forms.js');
var utils = require('../utils.js');
var User = models.User;

module.exports = function (app) {
    app.get('/logout/', function(req, res){
        req.session.destroy(function(){
            res.redirect('/');
        });
    });

    
    app.post(
        '/login/', forms.LoginForm,
        function(req, res) {
            if (req.form.isValid) {
                User.authenticate(
                    req.form.email, req.form.password,
                    function (err, user) {
                        if (user) {
                            req.session.regenerate(function(){
                                req.session.user = user;
                                res.redirect('/home/');
                            });
                        } else {
                            if (!req.session.messages)
                                req.session.messages = [];
                        
                            req.session.messages.push(
                                'Autenticação falhou, verifique seu usuário e senha');
                            res.redirect('back');
                        }
                    });         
            } else {
                req.session.messages = _.union(
                    req.session.messages||[],
                    req.form.errors);
                
                res.redirect('back');
            }

        });
    
    app.post(
        '/signup/', forms.SignupForm,
        function(req, res) {
            if (req.form.isValid) {
                User.newUser(
                    req.form.email, req.form.password,
                    function (err, user) {
                        if ((user)&&(!err)) {
                            req.session.regenerate(function(){
                                req.session.user = user;
                                res.redirect('/home/');
                            });
                        } else {
                            res.redirect('back');
                        }
                    });

            } else {
                req.session.messages = _.union(
                    req.session.messages||[],
                    req.form.errors);

                res.redirect('back');
            }
        });

};
