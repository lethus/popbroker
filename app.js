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

var express = require('express');
var MongoStore = require('connect-mongo'),
    mongo = require('mongoose');

var path = require('path');
if (path.existsSync('./configLocal.js')) {
	var configLocal = require('./configLocal.js');
	
	mail = require('mail').Mail(
		configLocal.getMailConfig());
	conf = configLocal.getSiteConfig();
}
else {
  log.error('Por favor copie o arquivo configDefault.js para configLocal.js e substitua os valores padrões.');
}


var app = module.exports = express.createServer(
    express.bodyParser()
  , express.cookieParser()
  , express.session({
      secret: conf.secret,
      maxAge: new Date(Date.now() + 3600000),
      store: new MongoStore(conf.db)
  })
);

app.set('view options', {
  layout: false
});

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

String.prototype.randomString = function(stringLength) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  if (!stringLength>0) {
    var stringLength = 8;
  }
  var randomString = '';
  for (var i=0; i<stringLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum,rnum+1);
  }
  return randomString; 
}

app.dynamicHelpers({
    messages: function(req){
        var msgs = req.session.messages;
        req.session.messages = null;
        return msgs
    },
    user: function (req) {
        if (req.session)
            return req.session.user;
    }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

require('./routes.js')(app);

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}
