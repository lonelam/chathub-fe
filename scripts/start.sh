#!/bin/sh
sed -i 's/\[BACKEND_HOST\]/'$BACKEND_HOST'/g' /etc/nginx/nginx.conf
nginx -g 'daemon off;'
