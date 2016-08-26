'use strict';

var pmx           = require('pmx');
var MongoClient   = require('mongodb').MongoClient;
var assert        = require('assert');
var fs            = require('fs');
var _             = require('lodash');

// init module
pmx.initModule({
  // widget defintion
  widget : {
    pid     : pmx.resolvePidPaths(['/var/run/mongodb.pid', '/var/run/mongodb/mongodb.pid']),
    // for keymetrics
    logo    : 'https://raw.githubusercontent.com/yoctore/yocto-pm2-agent/master/assets/mongodb.png',
    // for your tools
    icon    : 'mongodb',
    // maybe you need theme info ? but keep this for keymetrics
    theme   : [ '#262E35', '#222222', '#3ff', '#3ff' ],
    // normal config
    el      : {
      probes        : true,
      actions       : true
    },
    block   : {
      actions       : false,
      issues        : false,
      meta          : true,
      'main_probes' : [ 'Insert', 'Query', 'Update', 'Delete',
                        'Resident Memory', 'Traffic in', 'Traffic out',
                        'Connections',
                      ]
    }
  }
}, function (err, conf) {
  // default value
  var url = 'mongodb://' + (conf.auth ? (conf.username + ':' + conf.password + '@') : '') +
    conf.ip + ':' + conf.port + '/' + conf.database;

  // default options
  var options = {
    'uri_decode_auth' : true
  };

  // add ssl property
  if (conf.ssl !== false) {
    // add ssl flag on url for mongoclient
    url += '?ssl=true';
    // Build options
    options = {
      server : {
        sslValidate         : conf.sslValidate,
        checkServerIdentity : conf.checkServerIdentity
      }
    };

    // has ca ?
    if (conf.sslCa) {
      options.server.sslCA    = [ fs.readFileSync(conf.sslCa) ];
    }
    // has key ?
    if (conf.sslKey) {
      options.server.sslKey   = fs.readFileSync(conf.sslKey);
    }
    // has cert ?
    if (conf.sslCert) {
      options.server.sslCert  = fs.readFileSync(conf.sslCert);
    }
  }

  // Set this value to reconnect automatically to mongodb
  options.server = _.merge(options.server, {
    reconnectTries    : 'Number.MAX_VALUE',
    'auto_reconnect'  : true
  });

  if (!_.isEmpty(conf.authDB)) {
    // add auth Source to db
    options.db = {
      authSource : conf.authDB
    };
  }

  // add connection value on config object
  conf.connection = {
    url     : url,
    options : options
  };

  // try to connect to verify if connection is ok
  MongoClient.connect(url, options, function (err, db) {
    // has error ?
    assert.equal(null, err);
    // get db storage engine
    db.admin().serverStatus(function (err, info) {
      // need to check here if mongo version is >= 3.2.0
      // has error ?
      assert.equal(null, err, err);
      // set engine
      conf.engine = info.storageEngine.name;
      // set version
      conf.mongoVersion = info.version;
      // define state
      var state = info.version.split('.');
      // build version check
      state = [ state[0], state[1] ].join('.');
      // assert test
      assert.equal('3.2', state, [ 'Invalid mongo version.',
                                   'works only with mongo >= 3.2',
                                   'current mongo version is', info.version ].join(' '));
      // log message
      console.log([ 'Connected correctly to server.',
                     'Storage engine is [', info.storageEngine.name, '] and mongo version is [',
                     info.version, ']' ].join(' '));
      // close connection
      db.close();
    });
  });

  // defautl require stat
  require('./lib/mongostat.js');
});
