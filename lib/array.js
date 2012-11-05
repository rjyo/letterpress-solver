Array.prototype.add = function(a2) {
  var l1 = this.length;
  var l2 = a2.length;
  var len = (l1 < l2 ? l1 : l2);
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    result[i] = this[i] + a2[i];
  }
  return result;
}

Array.prototype.sub = function(a2) {
  var l1 = this.length;
  var l2 = a2.length;
  var len = (l1 < l2 ? l1 : l2);
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    result[i] = this[i] - a2[i];
  }
  return result;
}

Array.prototype.multiply = function(a2) {
  var l1 = this.length;
  var l2 = a2.length;
  var len = (l1 < l2 ? l1 : l2);
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    result[i] = this[i] * a2[i];
  }
  return result;
}

Array.prototype.sum = function() {
  var result = 0;
  for (var i = 0; i < this.length; i++) result += this[i];
  return result;
}

Array.prototype.expand = function() {
  var result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for (var i = 0; i < this.length; i++) result[this[i]] = 1;
  return result;
}

Array.prototype.removeDuplicates = function() {
  var results = [];
  for (var i = 0; i < this.length; i++) {
    var fail = false;
    for (var j = 0; j < results.length; j++) {
      if (isSameArray(results[j], this[i])) {
        fail = true;
        break;
      }
    }
    if (!fail) results.push(this[i]);
  }
  return results;
}

var isSameArray = function(a1, a2) {
  if (a1.length != a2.length) return false;

  for (var i = 0; i < a1.length; i++) if (!~a2.indexOf(a1[i])) return false;

  return true;
}
