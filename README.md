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

# install dependencies

* nodejs and npm
* python2 and [requests library](http://docs.python-requests.org/en/latest/)
* php
* [influxdb](http://influxdb.com/docs/v0.8/introduction/installation.html)

For nodejs, after install, remember ```npm i``` .  and remember clone submodule: ```git submodule init && git submodule update --init``` .

# continuous query
Write a Query ```select * from ER into ER.[hospital_sn]``` after your database created.

# Running
create a directory to save backup.
```bash
mkdir backup
```
Run twer.js to grab data from submodule.
```bash
node twer.js twer.csv --influxHost [yourHost] --influxDb [yourdatabase] --influxUser [youraccount] --influxPass [yourpass] > temp && ./backup.sh
```
Notice:  replace `[yourHost]`, `[yourdatabase]`, `[youraccount]` and `[yourpass]` to yours.

# purify backup files.
```python
python3 clerify.py [--dir <dir path>] [--output <output filename>]
```
The default dir is `backup`, and output name is `dataset.json`.  it be fixed to dump a json file, so you don't need add `.json`.
## dataset scheme
for the raw backup file, will be named as **"yyyy-mm-dd_HH-MM"**, for the `<date>` below, means `yyyy-mm-dd`, and `<timestamp>` means file name to be parse to timestamp.
```json
[{
  "<date>": {
    "<timestamp>": {"<each hospital data as a pydict>"},
  }
}]
```
