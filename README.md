er.mohw.g0v.tw
==============

Aggregate ER state liveboard

* grafana: http://er.mohw.g0v.tw
* map demo: http://jsbin.com/mequnuyuqiso/2/edit


# CC0 1.0 Universal

To the extent possible under law, Chia-liang Kao has waived all copyright
and related or neighboring rights to hackfoldr.

This work is published from Taiwan.

http://creativecommons.org/publicdomain/zero/1.0

# Influxdb docker 
## Install the influxdb 
Follow the steps here : https://github.com/tutumcloud/tutum-docker-influxdb
## Run the docker and the data will stored at host /data 
sudo docker run -d -p  8083:8083 -p 8086:8086 --expose 8090 --expose 8099 -v /data:/data tutum/influxdb

# query ER status periodically
node twer.js twer.csv  --influxHost IP --influxDb twER --influxUser guest --influxPass guest
