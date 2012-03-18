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
var models = require('../models/users.js');
var forms = require('../forms/users.js');
var User = models.User;

exports.add_routes = function (app) {
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
                                res.redirect(req.body.redir || '/home/');
                            });
                        } else {
                            if (!req.session.errors)
                                req.session.errors = [];
                        
                            req.session.errors.push(
                                'Autenticação falhou, verifique seu usuário e senha');
                            res.redirect('back');
                        }
                    });         
            } else {
                req.session.errors = _.union(
                    req.session.errors||[],
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
                            if (err.errors.email) {
		                        req.session.errors.push(
		                        	err.errors.email.type);
	                        }	                        
                            res.redirect('back');
                        }
                    });

            } else {
                req.session.errors = _.union(
		                req.session.errors||[],
		                req.form.errors);
                res.redirect('back');
            }
        });
        

    app.get('/forgot-password', function(req, res) {
    	res.render('users/forgot-password');
    });
    
    app.post(
    		'/forgot-password', forms.ResetPasswdForm, 
    		function(req, res) {
    			if (req.form.isValid) {
    				User.findOne({email: req.form.email}, function (error, user) {
    					if (user && user.password) {
    						var oldPasswordHash = encodeURIComponent(user.password);
    						var userId = user._id;
    						var resetLink = conf.site_url+"/reset-password/?userId="+userId+"&verify="+oldPasswordHash;
    						var resetMessage = "Olá, <br/>Clique no link para resetar sua senha no PopBroker:<br/><a href=\""+resetLink+"\">"+resetLink+"</a>";
    						mail.message({
    							'MIME-Version': '1.0',
    							'Content-type': 'text/html;charset=UTF-8',
    							from: 'PopBroker Suporte <'+ conf.site_email + '>',
    							to: user.email,
    							subject: conf.site_name + ': resetar senha'
    						}).body(resetMessage)
								.send(function(err) {
    								if (err) {
    									req.session.errors.push(
    										err.toString());
    									res.redirect('back');
    								}
    							});
							
							req.session.messages.push(
								'E-mail enviado com sucesso. Go verifique sua inbox!');
							res.redirect('back');
    					}
    					else {
    						req.session.errors.push(
    							"E-mail não encontrado na lista de usuários!");
    						res.redirect('back');
    					}
    				});
    			}
    			else {
    				req.session.errors = _.union(
		                req.session.errors||[],
		                req.form.errors);
					res.redirect('back');
    			}
    });
    
    app.get('/reset-password', function(req, res, next) {
    	var userId = req.query.userId;
    	var verify = decodeURIComponent(req.query.verify);
    	var password = '';
    	if (userId && verify) {
    		User.findOne({_id: userId}, function (error, user) {
    			if (user && user.password == verify) {
    				User.resetPassword(userId, function (error, result) {
    					if (error) {
    						req.session.errors.push(
    							'Não foi possível resetar a senha');
    						res.render('users/reset-password');
    					}
    					else {
    						password = result;
    						res.render('users/reset-password', {password: password});
    					}
    				});
    			}
    			else {
    				req.session.errors.push(
    					'Não foi possivel encontrar o usuário ou o link para resetar a senha expirou');
    				res.render('users/reset-password');
    			}
    		});
    	}
		else {
    		req.session.errors.push(
    			'Este link expirou, a senha não pode ser resetada');
    		res.render('users/reset-password');
    	}
    });
};
