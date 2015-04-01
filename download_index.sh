#!/bin/bash
#Script used to SSH into a remote server with mongos access, dump the indexes in
#JSON format, download locally over SCP for use with the ./indexer.js script
#to output indexes in a format consumable for tracking changes to indexes in
#GitHub

echo 'Script used to dump remote Mongo indices, and download over SCP for local consumption'

USER=$(whoami)   #User running command
#REMOTE_HOST=''  #Remote host with mongos access to cluster of choice
#MONGO_DB=''     #Mongo DB for which to get indexes

set -exu

# Ensure all variables are bound
echo "$REMOTE_HOST $MONGO_DB" > /dev/null 2>&1

# Connect to remote host, export Index records and upload to S3
ssh ${USER}@${REMOTE_HOST} -- "(mongoexport -d ${MONGO_DB} -c system.indexes --jsonArray -o ${MONGO_DB}.json)"

# Download from Remote Server
scp ${USER}@${REMOTE_HOST}:${MONGO_DB}.json .

echo "${MONGO_DB} indexes downloaded successfully, please use ./indexer ${MONGO_DB}.json > ${MONGO_DB}.js"
exit
