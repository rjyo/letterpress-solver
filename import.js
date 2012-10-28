var _ = require('underscore')
  , redis = require('redis')
  , fs = require('fs')
  , client = redis.createClient();

var importContent = function(content) {
  var index = content.indexOf('\n');
  var last = 0;
  while (index > -1) {
    var line = content.substring(last, index);
    last = index + 1;

    key = line.split('');
    key = key.sort(caseIsensitiveComp)
    key = key.join('');

    var keys = twoCharsKeys(key);
    _.each(keys, function(aKey) {
      client.sadd('lp:' + aKey, line);
    });

    // console.log(keys + ' | key = ' + key + ' | original = ' + line);
    index = content.indexOf('\n', last);
  }
}

var caseIsensitiveComp = function(strA, strB) {
    return strA.toLowerCase().localeCompare(strB.toLowerCase());
}

var twoCharsKeys = function(str) {
  var index = 0;
  var keys = []
  while (index < str.length - 1) {
    var key = str.substring(index, index + 2);
    index++;
    keys.push(key);
  }

  return keys;
}

var importFile = function(fileName) {
  console.log('Working on ' + fileName + '...');
  var content = fs.readFileSync(fileName, 'utf-8');
  importContent(content);
}

var importDir = function(dirName) {
  var files = fs.readdirSync(dirName);
  _.each(files, function(file) {
    importFile(dirName + '/' + file);
  });
}

importDir('./words');
