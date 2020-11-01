#!/bin/bash

docker stop accounting_system_sync
docker rm accounting_system_sync

echo y | docker system prune -a

docker run -d -ti --restart=always -e "TZ=Asia/Taipei" --hostname accounting_system_sync --name accounting_system_sync atkseegow/accounting_system_sync

docker cp /home/atkseegow/accounting_system_sync/collector.conf accounting_system_sync:/app/collector.conf

docker restart accounting_system_sync

exit;
EOF
