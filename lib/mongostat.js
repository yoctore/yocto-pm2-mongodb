'use strict';

var shelljs     = require('shelljs');
var pmx         = require('pmx');
var _           = require('lodash');

// process interval
setInterval(function () {
  // default command
  var mongostat = [ 'mongostat', '--port', pmx.getConf().port, '-n 1', '--all' ].join(' ');
  // has ip
  if (_.isString(pmx.getConf().ip) && !_.isEmpty(pmx.getConf().ip)) {
    // build host
    mongostat   = [ mongostat, '-h', pmx.getConf().ip ].join(' ');
  }

  // build full command
  if (_.isString(pmx.getConf().username) && !_.isEmpty(pmx.getConf().username) &&
      _.isString(pmx.getConf().password) && !_.isEmpty(pmx.getConf().password) &&
      _.isString(pmx.getConf().authDB) && !_.isEmpty(pmx.getConf().authDB)) {
    // build command
    mongostat = [ mongostat, '-u', pmx.getConf().username, '-p',
      [ '"', pmx.getConf().password, '"' ].join(''), '--authenticationDatabase',
      pmx.getConf().authDB ].join(' ');
  }

  // get ssl value
  var ssl  = pmx.getConf().ssl;
  var auth = pmx.getConf().auth;

  // here process ssl config if defined
  if (ssl !== false) {
    // enable ssl
    mongostat = [ mongostat, '--ssl' ].join(' ');

    // has ca ?
    if (ssl.ca) {
      // add command 
      mongostat = [ mongostat, '--sslCAFile', ssl.ca ].join(' ');
    }

    // has key ?
    if (ssl.cert) {
      // add command
      mongostat = [ mongostat, '--sslPEMKeyFile', ssl.cert ].join(' ');
    }

    // check identify ?
    if (!ssl.checkServerIdentity) {
      // add command
      mongostat = [ mongostat, '--sslAllowInvalidHostnames' ].join(' ');
    }
  }
  // enable auth mechanism
  if (auth.authenticationMechanism !== false && !_.isEmpty(auth.authenticationMechanism)) {
    // add command
    mongostat = [ mongostat, '--authenticationMechanism',
      [ '"', auth.authenticationMechanism, '"' ].join(' ') ].join(' ');
  }

  // process
  shelljs.exec(mongostat, {
    async   : true,
    silent  : false
  }, function (err, out) {
    // has error ?
    if (err) {
      // process error
      return console.error('Fail : could not retrieve mongostat metrics', err);
    }

    // get all datas and remove trailling chars
    var info = out.replace(/[\s\n\r]+/g,' ');
    // split data
    var data = info.split(' ');

// 3.0.x en mode --all en mmapv1
// insert query update delete getmore command flushes mapped vsize    res non-mapped faults qr|qw ar|aw netIn netOut conn     time
//     *0    *0     *0     *0       0     2|0       0 480.0M  3.4G 129.0M       2.9G      0   0|0   0|0  158b    20k    1 18:22:18

// 3.0.x en mode --all en WT

// en 3.2.x -- all en mmapv1
// insert query update delete getmore command flushes mapped vsize    res non-mapped faults lr|lw % lrt|lwt qr|qw ar|aw netIn netOut conn                      time
//    *0    *0     *0     *0       0     3|0       0 480.0M  3.4G 132.0M       2.9G      0                   0|0   0|0  237b    32k    1 2016-08-18T16:31:39+04:00
// en 3.2.x -- all en WT

// Default probes
/*insert
query 
update
deleted
getmore
command
flushes
dirty
used
mapped
vsize
nmapped
res
faults
lr
lw
lrt
lwt
qr
qw
ar
aw
netIn
netOut
conn
*/
    if (!_.isUndefined(pmx.getConf().engine)) {
      // get probes from files
      var probes = require('./probes')(pmx.getConf().engine);
      // Config part
      var config = [
        {
          key   : 'mmapv1',
          value : [ probes.insert, probes.query, probes.update, probes.deleted, probes.getmore,
                    probes.command, probes.flushes, probes.mapped, probes.vsize, probes.res,
                    probes.nmapped, probes.faults, probes.lr, probes.lw, probes.lrt, probes.lwt,
                    probes.qr, probes.qw, probes.ar, probes.aw, probes.netIn, probes.netOut,
                    probes.conn ]
        }, { 
          key   : 'wiredTiger',
          value : []
        }
      ];

      // get correct probes configuration
      var config = _.find(config, { key : pmx.getConf().engine });

      // parse all probes and set value
      _.each(config.value, function (v, k) {
        // set value
        v.set(data[k]);
      });
    }
  });
}, pmx.getConf().refreshDelay || 5000);