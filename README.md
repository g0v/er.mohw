ER board
==============

Aggregate ER state liveboard

* grafana: http://er.mohw.g0v.tw
* map demo: http://jsbin.com/mequnuyuqiso/2/edit

### CC0 1.0 Universal

To the extent possible under law, Chia-liang Kao has waived all copyright and related or neighboring rights to hackfoldr.

This work is published from Taiwan.  
http://creativecommons.org/publicdomain/zero/1.0

# Install dependencies

* nodejs **v0.10.x** ( v4.2.3LTS can work too.)
* npm
* After install, remember install npm modules ```npm i execSync csv q minimist shelljs influx ```
* python2 and [requests library](http://docs.python-requests.org/en/latest/)
* php **v5.x** (didn't test on php7, if you do that, PR welcome.)
* After install php, install php5-curl
* [influxdb](http://influxdb.com/docs/v0.8/introduction/installation.html) **v0.8.3(git:fbf9a47)**  
  **( if you use the newest version of influxdb, nodejs and npm, please check the update info on it.

# Clone repo submodules
remember clone submodule: ```git submodule init && git submodule update --init``` .

### Continuous query
Write a Query ```select * from ER into ER.[hospital_sn]``` after your database created.


# Running
**Please make sure you already install all dependencies**, create a directory to save backup.
```bash
mkdir backup
```
Run twer.js to grab data from submodule.
```bash
node twer.js twer.csv --influxHost [yourHost] --influxDb [yourdatabase] --influxUser [youraccount] --influxPass [yourpass] > temp && ./backup.sh
```
Notice:  replace `[yourHost]`, `[yourdatabase]`, `[youraccount]` and `[yourpass]` to yours.


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
