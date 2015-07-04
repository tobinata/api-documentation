var sys = require('sys')
  , exec = require('child_process').exec
  , _ = require('underscore')
;
var apikey = "759c06c96ffbad27ade95df148b10e07643f532fc1e9c157";
var url = "http://127.0.0.1:3000";
var endpoint="/api/v1/schools"
console.log('curl -s --data "apikey='+apikey+'" '+url+'/auth/api');
exec('curl -s --data "apikey='+apikey+'" '+url+'/auth/api', function(err, response) {
  var tokendata = JSON.parse(response);
  var cmd = 'curl -H "content-type:application/json" -H "x-access-token:'+tokendata.token+'" -H "x-key:'+apikey+'" '+url+endpoint;
  console.log(cmd)
  exec(cmd, function(err, response) {
    var data = JSON.parse(response);
    console.log(data);
  })
})

