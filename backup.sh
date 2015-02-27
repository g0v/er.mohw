#! /bin/bash

now=$(date "+%Y-%m-%d_%H-%M")
sed 's/\(}{\)/}\'$'\n{/g' temp |\
sed 's/.*\({.*}\).*/\1/g' |\
grep -e "{\(.*\:.*\)}" >>"$now"
#grep -e "{" temp | grep -e "}" |grep -v "null" | sed 's/.*\({.*}\).*/\1/g' >> "$now"

sed "1,35d" temp | \
sed "s/allresolved/\\n`wc -l $now`/g" | \
sed 's/\(}{\)/}\'$'\n{/g' | \
sed "/.*:.*[,|}]/d" >> error.log

mv "$now" backup/
