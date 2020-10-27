#!/usr/bin/env node
#build.sh
clear
echo "===================="
echo "starting build script"
echo "===================="
echo "creating temp folder"
mkdir ./Api_Gateway/nginx
cp ./nginx/* ./Api_Gateway/nginx/

mkdir ./notification_client/nginx
cp ./nginx/* ./notification_client/nginx/

docker-compose up --build
echo "===================="
echo "cleaning up build"
echo "===================="

rm -rf ./notification_client/nginx
rm -rf ./Api_Gateway/nginx


echo "===================="
echo "build finished"
echo "===================="