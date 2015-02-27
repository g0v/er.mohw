#! /bin/bash

now=$(date "+%Y-%m-%d_%H-%M")
grep -e "{" temp | grep -e "}" |grep -v "null" | sed 's/.*\({.*}\).*/\1/g' >> "$now"
mv "$now" backup/
