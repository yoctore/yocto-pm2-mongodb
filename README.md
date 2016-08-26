## Overview

This module provide metrics from pm2 agent for keymetrics or for your own tools.

This module support SSL, Auth config for secure mongodatabase

It's recommended to use an user with specific rights to connection on your database to retrieve metrics with [mongostat](https://docs.mongodb.com/manual/reference/program/mongostat/).

## How to install

```javascript
pm2 install yocto-pm2-mongodb
```

## How to use with keymetrics

Read Keymetrics documentation : http://pm2.keymetrics.io/docs/usage/monitoring/#keymetrics-monitoring.


## How to use with your own tools.

Step 1 : You need just change the mode use on module config, and set your own name. (by default is keymetrics)

```bash
pm2 set yocto-pm2-mongodb:config YOUR_CONFIG_NAME
```

Step 2 : Use your own tools with pm2 API to get metrics

