var assert = require("assert");

require("../index").add();

module.exports = {
  "extend": function() {
    var original = {"wow": "cool"};
    var result = Object.extend(original, {"whatever": "lame"});
    assert.deepEqual(original, result);
  },
  "values": function() {
    var object = {"wow": "cool", "whatever": "lame"};
    assert.deepEqual(Object.values(object), ["cool", "lame"]);
  },
  "isNumber": function() {
    assert.ok(Object.isNumber(5));
  },
  "isDate": function() {
    assert.ok(Object.isDate(new Date));
  },
  "isUndefined": function() {
    assert.ok(Object.isUndefined(undefined));
  },
  "isString": function() {
    assert.ok(Object.isString("hi"));
  },
  "isFunction": function() {
    assert.ok(Object.isFunction(function() {}));
  }
};

