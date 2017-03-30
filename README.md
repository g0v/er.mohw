ER board
==============

Aggregate ER state liveboard

* grafana: http://er.mohw.g0v.tw
* map demo: http://jsbin.com/mequnuyuqiso/2/edit

### CC0 1.0 Universal

To the extent possible under law, Chia-liang Kao has waived all copyright and related or neighboring rights to hackfoldr.

This work is published from Taiwan.  
http://creativecommons.org/publicdomain/zero/1.0

# Overview
### this project contains three parts:
- **influxdb**, database for store time serial json data from scripts.
- **grafana**, in gh-pages branch, frontend website.
- **crawlers**, submodules in this branch(master), to crawling data from hospitals.


# Install influxdb
1. we suggest to use **v0.8.3(git:fbf9a47)** [influxdb](http://influxdb.com/docs/v0.8/introduction/installation.html)
(this repo built on it, if you use newest version, please check the update information.)
2. Continuous Query: write a Query ```select * from ER into ER.[hospital_sn]``` after your database created.


# Install crawlers
### dependencies
* nodejs **v0.10.x** or **v4.2.3LTS**. (npm also required, it usually installed with nodejs)  
 (remember install npm modules from package.json. (`npm install` or `npm i`)
* python2 and [requests library](http://docs.python-requests.org/en/latest/).
* php **v5.x** and php5-curl. (didn't test on php7, if you do that, PR welcome.)

### submodules
* use ```git clone --recursive https://github.com/g0v/er.mohw``` to clone submodules in the same time.
* or run ```git submodule init && git submodule update --init``` to clone submodules. (`cd` to repo directory)


# Running
### Please make sure you already installed influxdb and crawlers.
1. Run `mkdir backup` to create a directory to save backup.
2. Run twer.js to grab data from submodule:
```bash
$ node twer.js twer.csv --influxHost [yourHost] --influxDb [yourdatabase] --influxUser [youraccount] --influxPass [yourpass] > temp && ./backup.sh
```
#### Notice:
- replace `[yourHost]`, `[yourdatabase]`, `[youraccount]` and `[yourpass]` to yours.
- the `node ...` command will **ONLY** grab data once, if you need continuous grab data into influxdb, please use `crontab` to schedule it. (we suggest 20mins or more)


# grafana frontend website
- clone `gh-pages` branch to another folder.
- modify `influxdb:{...}` content in config.js to fit your influxdb settings.
- run a website service to provide frontend website.


# Other usages

### Purify backup files.
```python
python3 clerify.py [--dir <dir path>] [--output <output filename>]
```
The default dir is `backup`, and output name is `dataset.json`.  it be fixed to dump a json file, so you don't need add `.json`.
### Dataset scheme
for the raw backup file, will be named as **"yyyy-mm-dd_HH-MM"**, for the `<date>` below, means `yyyy-mm-dd`, and `<timestamp>` means file name to be parse to timestamp.
```json
[{
  "<date>": {
    "<timestamp>": {"<each hospital data as a pydict>"},
  }
}]
```
### Add new parser
1. write down new parser in gist.
2. insert new row into twer.csv
3. run `node twer.js twer.csv --update --only <hospital_sn>`, if you want to update all, just run `node twer.js twer.csv --update`

### influx-db docker images wtih usages
1. docker pull t0mst0ne/influx-er
2. sudo docker run --restart=always -d -p  8083:8083 -p 8086:8086 --expose 8090 --expose 8099 -v /somewhere/data:/data t0mst0ne/influx-er
3. edit crontab with the following lines , assume the repo er.mohw was at /somewhere/
4. */20 * * * *  cd /somewhere/er.mohw && /usr/bin/node /somewhere/er.mohw/twer.js /somewhere/er.mohw/twer.csv  --influxHost x.x.x.x (ip address) --influxDb twer --influxUser guest --influxPass guest > temp && ./backup.sh
