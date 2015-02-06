// script to parse system.index json into ensureindex queries
// pass filename as argument to the indexer.js file.
// ex: node indexer.js vsco.json
fs = require('fs');

var fileName = process.argv.slice(2)[0];

// skipped collections
var skippedCollections = [
  'system'
];

// acceptable mongo ensureIndex options
var options = [
  'background',
  'unique',
  'name',
  'dropDups',
  'sparse',
  'expireAfterSeconds'
];

fs.readFile(fileName, 'utf8', function (err,data) {
  if (err) {
    return console.log('Error! file does not exist: ' + fileName);
  }

  // parsed commands
  var results = {};

  // convert file to JSON object (array of objects)
  var jsonData = JSON.parse(data);

  // iterate over items in the JSON array
  for (var i = 0; i < jsonData.length; i++) {
    var collection = jsonData[i].ns.split('\.')[1];

    // skip for internal mongo collections
    if (skippedCollections.indexOf(collection) !== -1) {
      continue;
    }

    // index keys
    var indexKey = jsonData[i].key;

    // index query options
    var queryOptions = {};
    options.forEach(function(item) {
      if (jsonData[i][item]) {
        queryOptions[item] = jsonData[i][item];
      }
    });

    // build query command
    var queryString = [
      JSON.stringify(indexKey),
      JSON.stringify(queryOptions)
    ].join(', ');

    if (typeof results[collection] !== 'object') {
      results[collection] = [];
    }
    results[collection].push(queryString);
  }

  // sort by collection for output
  keyIndex = returnSortedIndexKeys(results);
  // output queries
  createEnsureIndexQueries(keyIndex, results);
});

var returnSortedIndexKeys = function(resultData) {
  var indexKeys = [];
  for (var index in resultData) {
    indexKeys.push(index);
  }
  indexKeys.sort();
  return indexKeys;
};

var createEnsureIndexQueries = function(collectionIndex, statementData) {
  collectionIndex.forEach(function(collection) {
    console.log('//' + collection + ' indices');

    statementData[collection].forEach(function(indexQuery){
      buildIndexQuery(collection, indexQuery);
    });

    console.log();
  });
};

var buildIndexQuery = function(collection, query) {
  var ensureIndex = 'db.' + collection + '.ensureIndex(' + query + ');';
  console.log(ensureIndex);
};
