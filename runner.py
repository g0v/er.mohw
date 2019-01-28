#!/usr/bin/env python3
# -*- coding:utf-8 -*-
""" Taiwan ER board crawler runner. """
import sys
import time
import json
import asyncio
import argparse
from csv import DictReader
from pathlib import Path
from itertools import chain
from functools import partial

from influxdb.influxdb08 import InfluxDBClient

CRAWLER_DIR = "crawlers"
SERIES_NAME = "ER"
LANGS = {
    "*.py": r"python",
    "*.php": "php",
}


def load_records(filepath, encoding="utf8"):
    with open(filepath, encoding=encoding) as fp:
        records = [dict(row) for row in DictReader(fp)]
    return records[1:]


def data_transform(*datapoints):
    columns = [k.lower() for k in set(chain(*[p.keys() for p in datapoints]))]
    points = [[point.get(col) for col in columns] for point in datapoints]
    return columns, points


async def run_shell(cmd, *args, **kws):
    PIPE = asyncio.subprocess.PIPE
    create = asyncio.create_subprocess_exec(cmd, *args, **kws,
                                            stdout=PIPE, stderr=PIPE)
    proc = await create
    stdout, stderr = await proc.communicate()
    if stderr:
        print(stderr.decode(errors='ignore').strip(), file=sys.stderr)
    return stdout.decode().strip(), proc.returncode


async def run_crawler(cmd, path):
    try:
        stdout, rtcode = await run_shell(cmd, path)
        assert stdout
        data = json.loads(stdout)
    except AssertionError:
        msg = "FAIL[%s] when executing script %s"
        print(msg % (rtcode, path), file=sys.stderr)
    except json.JSONDecodeError:
        msg = "FAIL[%s] when parsing output %s"
        print(msg % (rtcode, path), file=sys.stderr)
    else:
        print(data)
        return data
    return dict()


async def update_crawler(path, gist_url=""):
    path = Path(path)
    if path.exists():
        gitpath = path.joinpath('.git')
        if gitpath.exists():
            await run_shell("git", "pull", "origin", "master", cwd=str(path))
        else:
            await run_shell("git", "submodule", "init", str(path))
            await run_shell("git", "submodule", "update", str(path))
    elif gist_url:
        await run_shell("git", "submodule", "add", gist_url, str(path))
    else:
        print("crawler(%s) missing." % path, file=sys.stderr)


async def main(args):
    def check_cb(sn_num, fut):
        rv = fut.result()
        if not rv:
            return
        if isinstance(rv, list):
            print("===", sn_num, "array found")
            rv = rv[0]
        rv_ = {k.lower(): val for k, val in rv.items()}
        rv.clear()
        rv.update(rv_)

        if rv.get('hospital_sn') != sn_num:
            rv['hospital_sn'] = rv.pop('hosptial_sn', sn_num)
            print(sn_num, "?===", rv)

        t = rv.pop('update_time', "null")
        try:
            t = int(t) or time.time()
        except ValueError:
            t = time.time()
        rv['time'] = int(t * 1000)
        rv['hospital_sn'] = rv.get('hospital_sn', sn_num)

    rows = load_records(args.dataset)

    if args.mapping:
        data = dict((r['hospital_sn'], r['abbr_zh']) for r in rows)
        print(json.dumps({"hospital_name": data}, indent=4, ensure_ascii=False))
        return

    if args.sn_numbers:
        rows = [r for r in rows if r['hospital_sn'] in args.sn_numbers]

    if args.update:
        fs = set()
        for r in rows:
            path = Path(CRAWLER_DIR).joinpath(r['hospital_sn'])
            url = r.get('scraper')
            fs.add(update_crawler(path, url))
        await asyncio.gather(*fs)
        print("=== done update.")

    fs = []
    for r in rows:
        path = Path(CRAWLER_DIR).joinpath(r['hospital_sn'])
        scripts = [(cmd, str(file)) for pattern, cmd in LANGS.items()
                   for file in path.iterdir() if file.match(pattern)]
        if not scripts:
            print("NO useable script in %s" % path, file=sys.stderr)
            continue
        cmd, path = scripts[0]
        fut = asyncio.ensure_future(run_crawler(cmd, path))
        fut.add_done_callback(partial(check_cb, r['hospital_sn']))
        fs.append(fut)

    datum = await asyncio.gather(*fs)

    if all({args.host, args.user, args.pwd, args.db}):
        cli = InfluxDBClient(username=args.user, password=args.pwd,
                             host=args.host, database=args.db)
        # used to resolve array found in `check_cb`
        datum = [d[0] if isinstance(d, list) else d for d in datum if d]
        cols, points = data_transform(*datum)
        datum = [dict(columns=cols, points=points, name=SERIES_NAME)]
        cli.write_points(datum, time_precision='m')


if __name__ == '__main__':
    arg = argparse.ArgumentParser(description=__doc__)
    arg.add_argument("dataset", help="csv format contains hospital informations.")
    arg.add_argument("-l", "--genmap", dest="mapping", action="store_true",
                     help="generate a json mapping for hospital(SN/name).")
    arg.add_argument("--update", action="store_true",
                     help="update submodules.")
    arg.add_argument("--only", dest="sn_numbers", type=str, nargs="*",
                     help="run only specific hospital crawlers.")
    arg.add_argument("-host", "--influx-host", dest="host")
    arg.add_argument("-user", "--influx-user", dest="user")
    arg.add_argument("-pass", "--influx-pass", dest="pwd")
    arg.add_argument("-db", "--influx-db", dest="db")

    if sys.platform == 'win32':
        loop = asyncio.ProactorEventLoop()
        asyncio.set_event_loop(loop)
    else:
        loop = asyncio.get_event_loop()

    loop.run_until_complete(main(arg.parse_args()))
