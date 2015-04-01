# Mongo Index Pareser
Set of scripts to facilitate the tracking of mongo indexes, or the ability to re-create your production level indexes locally.

## Requirements
* NodeJS
* Bash
* SSH access to remote server with mongos

## Usage

### Downloading Index

To receive a JSON document containing the indexes for a given DB, modify the `download_index.sh` file with appropriate config
```
USER=$(whoami)  #User running command
REMOTE_HOST=''  #Remote host with mongos access to cluster of choice
MONGO_DB=''     #Mongo DB for which to get indexes
```

Run the command with `./download_index.sh` and receive a copy of the db.json file locally.

### Converting Index to EnsureIndex format

Pipe the newly received index into `./indexer.js` and ensureIndex will output to console.

`./indexer db.json`

Feel free to also pipe this into a file for tracking, or use in scripts restoring indicies to local mongo instances.

`./indexer db.json > db.js`

### Example
```
$ ./download_index.sh
Script used to dump remote Mongo indices, and download over SCP for local consumption
connected to: 127.0.0.1
exported 124 records
DB indexes downloaded successfully, please use ./indexer DB.json > DB.js
$

$ ./indexer.js DB.json
//usermedia indices
db.usermedia.ensureIndex({"user.id":1,"_id":1}, {"background":true,"name":"shard_key"});
db.usermedia.ensureIndex({"user.id":1,"updated_last":1}, {"background":true,"name":"user_media_timestamp"});
$
```
