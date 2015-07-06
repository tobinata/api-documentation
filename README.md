# Whetstone API

### Pre-requisites
In order to access the API, you need a Whetstone account at the admin level and also to have requested that the API be enabled. If you do not have either of those pre-requesites, contact your network admin.

### Introduction

The first step to accessing the API is to get your API key.  After logging into Whetstone, visit the settings page (click your name at the top right and choose "My Settings").  You should see a section called "Developer Options" section.  (If you don't, get in touch.  You may not have the correct permissions set up.)  

By default, your API key is hidden.  Click, "Show my API key" to reveal an alphanumeric hash key.  That's your personal key to access Whetstone data.  You can also generate a new API key by clicking "Generate New API Key." That invalidates the old key and creates a new one.  

Now that you have an API key, you can make an HTTP POST request with your key to our authentication endpoint to get a temporary access token.  We've got a few  [example scripts](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts) available to get you started but If you're using cURL, you can run this command:

    curl -s --data "apikey=YOUR_API_KEY" http://YOUR_INSTANCE_NAME.whetstoneeducation.com/auth/api

If everything checks out, you should receive a JSON response that looks like this:

    {
       "token":"YOUR_ACCESS_TOKEN",
       "expires":1436662932981,
       "expiresFriendly":"2015-07-11T20:02:12-05:00",
       "user": {
         "name":"Your Name",
         "apikey":"YOUR_API_KEY"
       }
     }

Using the key and token, you can make data requests.  Let's get the list of schools.  The endpoint for schools data is:

    http://YOUR_INSTANCE.whetstoneeducation.com/api/v1/schools
    
To access data, you need to make an HTTP GET request with the *access-token* and *key* included in the headers. Using cURL, it would look like this.

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools;

If everything checks out, you'll get back all the schools data in Whetstone's database in JSON format.  If you want to get a single record, you can append a query string to your request. In cURL, it would look like this:

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools?name=Bel+Air+Academy;

In that example, you would request only the record where the name of the school is equal to Bel Air Academy.  You can use any data field in the query string. (Typically, you'll use an id number to get a single record.)

### Data Available
We currently have the following endpoints available:

**[School Data](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/schools.json)**: /api/v1/schools

**[User Data](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/users.json)**: /api/v1/users

**[Action Step and Goal Data](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/assignments.json)**: /api/v1/assignments

**[Observation Data](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/observations.json)**: /api/v1/observations

**[Quick Feedback Data](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/informals.json)**: /api/v1/informals

**[Course Names](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/courses.json)**: /api/v1/courses

**[Tag Names](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/tags.json)**: /api/v1/tags

If you click on the name, you'll see an example of what data is returned.  Again, each endpoint can also take query strings so if you wanted to find a single user record, you could make an HTTP GET request to: 

    /api/v1/users?_id=000000000000000000000000

Examples of what kind of data you can expect are in the [ExampleData](https://github.com/WhetstoneEducation/API/blob/master/ExampleData/) folder.  We also have [example scripts](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts) to get you started. We have provided a cross-platform Node.js script, a Windows PowerShell script, and a bash script that should run on Mac and Linux. If you have an example script in another language, please make a pull request. The more examples we have, the more useful this API will be.  And if you develop any cool tools using this API, please consider open-sourcing it so other schools can benefit. 