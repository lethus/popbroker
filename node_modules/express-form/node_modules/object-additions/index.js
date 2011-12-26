function getType(object) {
  return Object.prototype.toString.call(object);
}

exports.object = {
  values: function(object) {
    var values = [];
    Object.keys(object).forEach(function(name) {
      values.push(object[name]);
    });
    return values;
  },

  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  },
  
  isString: function(object) {
    return getType(object) === "[object String]";
  },
  
  isNumber: function(object) {
    return getType(object) === "[object Number]";
  },
  
  isDate: function(object) {
    return getType(object) === "[object Date]";
  },
  
  isUndefined: function(object) {
    return typeof object === "undefined";
  },
  
  isFunction: function(object) {
    return getType(object) === "[object Function]";
  }
};

exports.add = function(debug) {
  Object.keys(exports.object).forEach(function(name) {
    if (!Object.hasOwnProperty(name)) {
      Object.defineProperty(Object, name, {
        value: exports.object[name]
      });
      if (debug) console.log("Added Object." + name + "()");
    }
  });
  return Object;
};