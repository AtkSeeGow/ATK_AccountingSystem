#!/bin/bash

docker stop accountingsystem_web
docker rm accountingsystem_web

echo y | docker system prune -a

docker run -d -v /home/webster/certificate:/certificate -v /home/webster/projects/accountingsystem_web/LogFiles:/app/LogFiles -e "TZ=Asia/Taipei" -p 8910:5000 -p 8911:5001 --restart=always --link=mongodb --hostname accountingsystem_web --name accountingsystem_web atkseegow/accountingsystem_web

docker cp /home/webster/projects/accountingsystem_web/appsettings.json accountingsystem_web:/app/appsettings.json
docker cp /home/webster/projects/accountingsystem_web/NLog.config accountingsystem_web:/app/NLog.config

docker restart accountingsystem_web

exit;
EOF
