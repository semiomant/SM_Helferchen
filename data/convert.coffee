# this file needs to be run from node.js with the coffescript plugin!
#
fs = require 'fs'
args = process.argv.slice(2)
file = args[0]
insert_name = args[1]

fs.readFile "./#{file}",'utf-8', (err,data) ->
    data = JSON.parse data
    ary = []
    for key of data
        obj = data[key]
        obj[insert_name] = key
        ary.push obj
    newdata = JSON.stringify(ary)
    fs.writeFile "./new_#{file}", newdata, (err) -> console.log "done!"

