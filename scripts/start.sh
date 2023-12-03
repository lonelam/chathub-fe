#!/bin/sh
echo 'replacing backend host with '$BACKEND_HOST
sed -i 's/\[BACKEND_HOST\]/'$BACKEND_HOST'/g' /etc/nginx/conf.d/default.conf
cat /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
