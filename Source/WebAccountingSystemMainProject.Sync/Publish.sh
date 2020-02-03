#!/bin/bash

docker build -t atkseegow/accounting_system_sync:1.0.0 .

docker tag atkseegow/accounting_system_sync:1.0.0 atkseegow/accounting_system_sync:latest

docker push atkseegow/accounting_system_sync:1.0.0
docker push atkseegow/accounting_system_sync:latest
