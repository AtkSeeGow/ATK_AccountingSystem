#!/bin/bash

docker stop accounting_system_web
docker rm accounting_system_web

echo y | docker system prune -a

docker run -d -v ~/certificate:/certificate -e "TZ=Asia/Taipei" -p 8910:5000 -p 8911:5001 --restart=always --link=mongodb --hostname accounting_system_web --name accounting_system_web atkseegow/accounting_system_web

docker cp ~/accounting_system_web/appsettings.json accounting_system_web:/app/appsettings.json
docker cp ~/accounting_system_web/NLog.config accounting_system_web:/app/NLog.config

docker restart accounting_system_web

exit;
EOF