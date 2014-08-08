require! <[csv execSync fs q minimist shelljs influx]>
{update,influx-host,influx-db,influx-user,influx-pass}:argv = minimist process.argv.slice 2
[file] = argv._
var header, client
records = []

if influx-host
  client = influx do
    host : influx-host
    username : influx-user
    password : influx-pass
    database : influx-db

on-entry = (hospital_sn, it, cb)->
  if \Array is typeof! it 
    console.log \=== hospital_sn, "array found"
    it .= 0
  normalized = {[key.to-lower-case!, val] for key, val of it}
  console.log \ENTRY normalized
  console.log \==== hospital_sn, normalized.hospital_sn unless hospital_sn is normalized.hospital_sn
  console.log \FIXME it unless it === normalized
  normalized.time = (delete normalized.update_time) * 1000ms
  normalized.time ||= new Date!getTime!
  delete normalized.hosptial_sn
  normalized.hospital_sn ?= hospital_sn

  client?write-point 'ER', normalized, {}, cb

<- csv!from.stream fs.createReadStream file, \utf-8
.on \record (row,index) ->
  if index is 0
    header := row
  else if index > 1 and row[0]
    records.push {[header[i], row[i]] for i of row}

.on \end

q.all-settled <| records.map (r) ->
  dir = "crawlers/#{r.hospital_sn}"
  console.log dir
  if update
    if fs.exists-sync dir
      process.chdir dir
      execSync.run "git pull"
      process.chdir "../.."
    else
      execSync.run "git submodule add #{r.scraper} #dir"

  [php]? = shelljs.ls "#dir/*.php"
  [python]? = shelljs.ls "#dir/*.py"
  [ls]? = shelljs.ls "#dir/*.ls"
  [cmd, script] = switch
  | php => ["php", php]
  | python => ["python", python]
  | ls => ["lsc", ls]
  else => throw "wtf #dir"

  d = q.defer!
  shelljs.exec "#cmd #script", (code, output) ->
    res = try JSON.parse output
    if res
      on-entry r.hospital_sn, that, ->
        d.resolve!
    else
      console.log \FAIL r.hospital_sn, code, script
      d.resolve!
  d.promise

.then
console.log \allresolved
