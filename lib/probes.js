'use strict';

var pmx         = require('pmx');
var probe       = pmx.probe();
var _           = require('lodash');

// Default probes
module.exports = function (engine) {
  // default probes
  var probes = {
    insert    :  {
      metric  : probe.metric({
        name        : 'Insert',
        value       : 'N/A'
      }),
      options : {
        unit        : 'sec',
        description : [ 'The number of objects inserted into the database per second.',
                        'If followed by an asterisk (e.g. *),',
                        'the datum refers to a replicated operation.' ].join(' ')
      }
    },
    query     : {
      metric  : probe.metric({
        name          : 'Query',
        value         : 'N/A',
      }),
      options : {
        unit          : 'sec',
        description   : 'The number of query operations per second.'
      }
    },
    update    : {
      metric  : probe.metric({
        name          : 'Update',
        value         : 'N/A'
      }),
      options : {
        unit          : 'sec',
        description   : 'The number of update operations per second.'
      }
    },
    deleted   : {
      metric  : probe.metric({
        name          : 'Delete',
        value         : 'N/A'
      }),
      options : {
        unit          : 'sec',
        description   : 'The number of delete operations per second.'
      }
    },
    getmore   : {
      metric  : probe.metric({
        name          : 'Cursor batch',
        value         : 'N/A'
      }),
      options : {
        unit          : 'sec',
        description   : 'The number of get more (i.e. cursor batch) operations per second.'
      }
    },
    command   : {
      metric  : probe.metric({
        name          : 'Command',
        value         : 'N/A'
      }),
      options : {
        unit          : 'sec',
        description   : [ 'The number of commands per second. On slave and secondary systems,',
                          'data was presented the two values separated by a',
                          'pipe character (e.g. |),',
                          'in the form of local|replicated commands.' ].join(' ')
      }
    },
    flushes   : {
      metric  : probe.metric({
        name        : (pmx.getConf().engine === 'mmapv1' ?
          'FSync Operations' : 'Checkpoints triggered'),
        value       : 'N/A'
      }),
      options : {
        unit        : (pmx.getConf().engine === 'mmapv1' ? 'sec' : 'polling interval'),
        description : (pmx.getConf().engine === 'mmapv1' ?
          'Represents the number of fsync operations per second.' :
          'Refers to the number of WiredTiger checkpoints triggered between each polling interval.')
      }
    },
    vsize     : {
      metric  : probe.metric({
        name        : 'Virtual memory',
        value       : 'N/A'
      }),
      options : {
        description : [ 'The amount of virtual memory in megabytes used by the process',
                        'at the time of the last mongostat call.' ].join(' ')
      }
    },
    res       : {
      metric  : probe.metric({
        name          : 'Resident Memory',
        value         : 'N/A'
      }),
      options : {
        description   : [ 'The amount of resident memory in megabytes used by the process',
                          'at the time of the last mongostat call. ' ].join(' ')
      }
    },
    qrqw      : {
      metric  : probe.metric({
        name        : 'Waiting Read|Write',
        value       : 'N/A'
      }),
      options : {
        description : [ 'The length of the queue of clients waiting',
                        'to read|write data from the MongoDB instance.' ].join(' ')
      }
    },
    araw      : {
      metric  : probe.metric({
        name        : 'Current Read|Write',
        value       : 'N/A'
      }),
      options : {
        description : 'The number of active clients performing read|write operations.'
      }
    },
    netIn     : {
      metric  : probe.metric({
        name        : 'Traffic in',
        value       : 'N/A'
      }),
      options : {
        description : 'The amount of network traffic, in bytes, received by the MongoDB instance.'
      }
    },
    netOut    : {
      metric  : probe.metric({
        name        : 'Traffic out',
        value       : 'N/A'
      }),
      options : {
        description : 'The amount of network traffic, in bytes, sent by the MongoDB instance.'
      }
    },
    conn      : {
      metric  : probe.metric({
        name        : 'Connections',
        value       : 'N/A'
      }),
      options : {
        description : 'The total number of open connections.'
      }
    }
  };

  // only if a mmapv1
  if (engine === 'mmapv1') {
    // extend
    _.extend(probes, {
      faults      : {
        metric  : probe.metric({
          name        : 'Page Faults',
          value       : 'N/A'
        }),
        options : {
          unit        : 'sec',
          description : 'The number of page faults per second.'
        }
      },
      lrlw        : {
        metric  : probe.metric({
          name        : 'Acquisitions lock Read|Write',
          value       : 'N/A'
        }),
        options : {
          description : 'The percentage of read|write lock acquisitions that had to wait.'
        }
      },
      lrtlwt      : {
        metric  : probe.metric({
          name        : 'Acquisitions lock time Read|Write',
          value       : 'N/A'
        }),
        options : {
          description : [ 'The average acquire time, in microseconds,',
                          'of read|write lock acquisitions that waited.' ].join(' ')
        }
      },
      mapped      : {
        metric  : probe.metric({
          name        : 'Mapped data',
          value       : 'N/A'
        }),
        options : {
          description : [ 'The total amount of data mapped in megabytes.',
                          'This is the total data size at the time of the last mongostat call.'
                        ].join(' ')
        }
      },
      nmapped     : {
        metric  : probe.metric({
          name        : 'Non-Mapped data',
          value       : 'N/A'
        }),
        options : {
          description : [ 'The total amount of virtual memory excluding all',
                          'mapped memory at the time of the last mongostat call.' ].join(' ')
        }
      }
    });
  }

  // extend probes only if wiredTiger engine
  if (engine === 'wiredTiger') {
    // extend
    _.extend(probes, {
      dirty   : {
        metric  : probe.metric({
          name        : 'Cache dirty bytes',
          value       : 'N/A'
        }),
        options : {
          unit        : '%',
          description : 'The percentage of the WiredTiger cache with dirty bytes.'
        }
      },
      used    : {
        metric  : probe.metric({
          name        : 'Cache usage',
          value       : 'N/A'
        }),
        options : {
          unit        : '%',
          description : 'The percentage of the WiredTiger cache that is in use.'
        }
      }
    });
  }
  // default statement
  return probes;
};
