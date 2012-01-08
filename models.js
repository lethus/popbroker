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

var mongoose = require('mongoose')
  , crypto = require('crypto')
  , mongoTypes = require('mongoose-types');

mongoTypes.loadTypes(mongoose, 'email');
mongoose.connect('mongodb://localhost/popbroker');

function hash (msg, key) {
  return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

function required(val) { return val && val.length; }

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        validate: [required, 'Email é obrigatório'],
        index: { unique: true }
    },
    password: {
        type: String,
        validate: [required, 'Senha é obrigatório'],
    },
    createdAt: {
        type: Date,
        'default': Date.now
    }
});

UserSchema.path('email').validate(function (v, fn) {
    User.count({email: v}, function (err, val) {
        if (err) fn(false);
        fn(val==0);
    });
}, 'Email duplicado'); 

UserSchema.statics.authenticate = function (email, password, fn) {
    this.findOne({email: email}, function (err, user) {
        if (!user) return fn(new Error('cannot find user'));
        if (user.password == hash(password, 'lethus123')) return fn(null, user);
        // Otherwise password is invalid
        fn(new Error('invalid password'));
    });
};

UserSchema.statics.newUser = function (email, password, fn) {
    var instance = new User();
    instance.email = email;
    instance.password = hash(password, 'lethus123');

    instance.save(function (err) {
        fn(err, instance);
    });
};

User = mongoose.model('User', UserSchema);

exports.User = User;
