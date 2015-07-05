# Whetstone API

### Basic Concepts 
Just a note before we start: the Whetstone API is intended to be used by developers. Most of the documentation reflects that. In this introduction, we've tried to keep things simple enough that even a non-tech person can understand what's happening and get a sense for how an API works. 

When a typical user accesses Whetstone data, authentication is performed in the browser using a username and password or through a single-sign-on method like Google or Okta.  When that happens, our server and the user's browser communicate and set a "cookie" to keep the user authenticated for the rest of their browsing session.  When accessing the API, we use a similar process but instead of cookies, we use secure tokens.  

The first step to accessing the API is actually to login to Whetstone through a browser.  Click your name at the top right and choose "My Settings."  You should see a "Developer Options" section under My Basic Info.  If you don't, it's probably because you aren't set up as an admin or we haven't enabled API access for your instance.  If that's the case, get in touch and we'll get everything set up.  

If you do have the Developer options section, great.  This is where you get your API key.  By default, it's hidden.  If you click, "Show my API key," an alphanumeric hash will appear.  That's your personal key to access Whetstone data.  If it's ever compromised or if it's part of your security practices, you can generate a new API key by clicking "Generate New API Key." That invalidates the old key and creates a new one.  If we detect strange behavior on our end, we can also invalidate keys. 

Now that you have the key, you'll need to write a script to access our authentication endpoint -- which is equivalent to a login page -- and receive a temporary token that, with the key, can be used to access data.  In this example, we'll use cURL which is a Unix command line tool that's also been ported to Windows and other platforms.  It's just making HTTP requests so any similar software will work.  

OK. Open your command prompt and type, replacing the all caps text with your API key and your instance name:
````
curl -s --data "apikey=YOUR_API_KEY" http://YOUR_INSTANCE_NAME.whetstoneeducation.com/auth/api
````
If your everything worked, you should receive a response like this:
````
{
   "token":"YOUR_ACCESS_TOKEN",
   "expires":1436662932981,
   "expiresFriendly":"2015-07-11T20:02:12-05:00",
   "user": {
     "name":"Your Name",
     "apikey":"YOUR_API_KEY"
   }
 }
````
The main information thing to worry about is the token. That's what lets you access the data.  The other information is likely not of much use to your script but it's there to let you know everything worked. The token is good for 7 days. We send back the expiration in a unix timestamp and a human-friendly version. We also send back the user whose token was used in case you want to use that info for logging purposes.

Now that we're authenticated, we can actually request data.  Again, using cURL, we make an HTTP GET request to an endpoint, in this case the schools endpoint.
````
curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools;
````
If everything checks out and you copied everything correctly, you should get JSON data containing the list of schools in the Whetstone database.  You can also append a query string that allows you to filter data like this:
````
curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools?name=Bel+Air+Academy;
````
In that example, you'd request only the record where the name of the school is Bel Air Academy.  (Typically, you'd use an _id field for that.  It's mostly for joining data together in your script.)

Now that you've seen how the process works, take a look at our example scripts folder. We have a bash script for Mac, Linux, and Unix users and a PowerShell script for Windows users.  (Make sure you can run PowerShell scripts on your machine. By default, that's disabled.)  We're also happy to provide example scripts in other languages if we know them. If you've written one in a language we don't know, you can add it in through a GitHub pull request or, if you don't use Git, by sending it to someone at Whetstone. If you see any errors in this documentation, you submit corrections in the same way.