#!/usr/bin/env python3
# -*- coding:utf-8 -*-
""" clerify `fake` json data from er.mhow.  you can use --output to assign output file. """
import os
import sys
import json
import argparse
from datetime import datetime

def file_to_json(path):
    result = []
    with open(path) as f:
        raw = f.read()
    
    for li in raw.split('\n'):
        if li:
            try:
                result.append( json.loads(li))
            except Exception as e:
                print("catch an error: {} on files: {}, line:\n {} .".format(e, path, li))
    return result

def main(args):
    files=os.listdir(args.dir)
    if not files:
        raise FileNotFoundError("no file under {}".format(args.dir))
    print("found files: %d" % len(files))
    dataset = {}
    what_time = lambda f: datetime.strptime(f, '%Y-%m-%d_%H-%M')
    min_d = datetime.strptime(files[0], '%Y-%m-%d_%H-%M')
    max_d = min_d
    seeds = 0
    for f in files:
        date, times  = f.split('_')
        f_json = file_to_json('backup/'+f)
        seeds += len(f_json)
        times = datetime.strptime(f, '%Y-%m-%d_%H-%M').timestamp()
        if not dataset.get(date):
            dataset[date] = {}
        dataset[date].update({times:f_json})
        f_time = what_time(f)
        min_d = f_time if min_d > f_time else min_d
        max_d = f_time if max_d < f_time else max_d
    with open('{}.json'.format(args.output), 'w') as f:
        print("dump data to file: {}.json".format(args.output))
        json.dump([dataset], f)
    return 'file time from "{}" to "{}", total: {} counts.'.format(min_d, max_d, seeds)

if __name__ == '__main__':
    arg = argparse.ArgumentParser(description=__doc__)
    arg.add_argument('--dir', metavar='<path>', type=str, default='backup',
                      help="the dir path for backup files.")
    arg.add_argument('--output', metavar='<file>.json', type=str, default='dataset',
                      help="the name for saved json file.")
    args = arg.parse_args()
    sys.exit(main(args))
