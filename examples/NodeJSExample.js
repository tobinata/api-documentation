var sys = require('sys')
  , exec = require('child_process').exec
;

var apikey = ""; // YOUR API KEY GOES HERE
var url = "http://instance.whetstoneeducation.com";
var endpoint="/api/v1/schools"

exec('curl -s --data "apikey='+apikey+'" '+url+'/auth/api', function(err, response) {
  var tokendata = JSON.parse(response);
  var cmd = 'curl -H "content-type:application/json" -H "x-access-token:'+tokendata.token+'" -H "x-key:'+apikey+'" '+url+endpoint;
  console.log(cmd)
  exec(cmd, function(err, response) {
    var data = JSON.parse(response);
    console.log(data);
  })
})

