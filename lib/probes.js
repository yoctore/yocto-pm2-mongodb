'use strict';

var pmx         = require('pmx');
var probe       = pmx.probe();
  /**
          insert,
          query,
          update,
          deleted,
          getmore,
          command,
          flushes,
          mapped,
          vsize,
          res,
          nmapped,
          faults,
          lr,
          lw,
          lrt,
          lwt,
          qr,
          qw,
          ar,
          aw,
          netIn,
          netOut,
          conn
  */
// Default probes
module.exports = function (engine) {
  // default probes
  var probes = {
    insert : probe.metric({
      name  : 'Insert',
      value : 'N/A',
      unit  : 'sec'
    }),
    query : probe.metric({
      name  : 'Query',
      value : 'N/A',
      unit  : 'sec'
    }),
    update : probe.metric({
      name  : 'Update',
      value : 'N/A',
      unit  : 'sec'
    }),
    deleted : probe.metric({
      name  : 'Delete',
      value : 'N/A',
      unit  : 'sec'
    }),
    getmore : probe.metric({
      name  : 'Cursor batch',
      value : 'N/A',
      unit  : 'sec'
    }),
    command : probe.metric({
      name  : 'Command',
      value : 'N/A',
      unit  : 'sec'
    }),
    flushes : probe.metric({
      name  : (pmx.getConf().engine === 'mmapv1' ? 'FSync Operations' : 'Checkpoints triggered'),
      value : 'N/A',
      unit  : (pmx.getConf().engine === 'mmapv1' ? 'Sec' : 'Polling interval'),
    }),
    mapped  : probe.metric({
      name  : 'Mapped',
      value : 'N/A'
    }),
    vsize   : probe.metric({
      name  : 'Virtual memory',
      value : 'N/A'
    }),
    nmapped : probe.metric({
      name  : 'Non-Mapped',
      value : 'N/A'
    }),
    res     : probe.metric({
      name  : 'Resident Memory',
      value : 'N/A'
    }),
    faults  : probe.metric({
      name  : 'Page Faults',
      value : 'N/A',
      unit  : 'sec'
    }),
    lr      : probe.metric({
      name  : 'Read lock acquisitions',
      value : 'N/A'
    }),
    lw      : probe.metric({
      name  : 'Write lock acquisitions',
      value : 'N/A'
    }),
    lrt     : probe.metric({
      name  : 'Read lock acquisitions time',
      value : 'N/A'
    }),
    lwt     : probe.metric({
      name  : 'Write lock acquisitions time',
      value : 'N/A'
    }),
    qr      : probe.metric({
      name  : 'Waiting Read',
      value : 'N/A'
    }),
    qw      : probe.metric({
      name  : 'Waiting write',
      value : 'N/A'
    }),
    ar      : probe.metric({
      name  : 'Current Read',
      value : 'N/A'
    }),
    aw      : probe.metric({
      name  : 'Current write',
      value : 'N/A'
    }),
    netIn   : probe.metric({
      name  : 'Traffic in',
      value : 'N/A'
    }),
    netOut  : probe.metric({
      name  : 'Traffic out',
      value : 'N/A'
    }),
    conn    : probe.metric({
      name  : 'Connections',
      value : 'N/A'
    })
  };

    // extend probes only if not mmapv1 engine
  if (engine !== 'mmapv1') {
    // extend
    _.extend(probes, {
      dirty   : probe.metric({
        name  : 'Cache dirty bytes',
        value : 'N/A',
        unit  : '%'
      }),
      used    : probe.metric({
        name  : 'Cache usage',
        value : 'N/A',
        unit  : '%'
      })
    });
  }
  // default statement
  return probes;
};