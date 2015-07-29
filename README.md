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

###Getting Data from Whetstone - HTTP GET
Using the key and token, you can make GET requests to pull data.  Let's get the list of schools as an example.  The endpoint for schools data is:

    http://YOUR_INSTANCE.whetstoneeducation.com/api/v1/schools
    
To access data, you need to make an HTTP GET request with the *access-token* and *key* included in the headers. Using cURL, it would look like this.

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools;

If everything checks out, you'll get back all the schools data in Whetstone's database in JSON format.  

####Querying Data
If you want to query the database, you can append a query string to your endpoint. In cURL, it would look like this:

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools?name=Bel+Air+Academy;

In that example, you would request the record where the name of the school is equal to Bel Air Academy.  You can use any data field in the query string.

####Single Records by ID
If you want to access a record where you know the Whetstone _id field, you can make an HTTP GET request with the _id added to the endpoint.  For instance, to get a single school, you can use the endpoint: 

    http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools/000000000000000000000000 


#### Data Available via GET requests
We currently have the following endpoints available for HTTP GET requests:

**[School Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/schools.json)**: /api/v1/schools

**[User Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/users.json)**: /api/v1/users

**[Action Step and Goal Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/assignments.json)**: /api/v1/assignments

**[Observation Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/observations.json)**: /api/v1/observations

**[Quick Feedback Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/informals.json)**: /api/v1/informals

**[Course Names](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/courses.json)**: /api/v1/courses

**[Tag Names](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/tags.json)**: /api/v1/tags

**[Rubric Details](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/rubrics.json)**: /api/v1/rubrics

**[Observation Type Names](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/observationTypes.json)**: /api/v1/observationtypes

Examples of what kind of data you can expect are in the [EXAMPLE-GET-REQUEST-DATA](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/) folder.  

###Sending Data to Whetstone###
Pulling data is all well and good but what if you want to add or edit data?  That can be done through HTTP POST requests.  Only a subset of our data can be written in the API. If something you want to add isn't available here, get in touch and we'll discuss opening it up.

####Adding Data####
So, let's say you want to add a new user.  The authentication aspect is the same as making a GET request.  (If you haven't tried that part of the tutorial, it's a good idea to do that first before you start creating records willy-nilly.)  You just need to POST JSON data you want to add to the same endpoint.  For instance, to add a user with this data:
    {
      "name":"Some Name",
      "email":"some.name@domain.org"
    }

you can make this cURL command:

    curl -H "content-type:application/json" -X POST --data '{"name":"Fake User","email":"fakeuser@email.com"}' -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/users
  
You'll probably want to add additional fields to your users when adding them but name and email are required.  

####Editing Data

To edit a user already in the database, we use the same authentication process as above but make an HTTP POST request using the _id field. For a school, that would look like: 
  
    http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools/000000000000000000000000
  
So, to update a school's name, you would run the following cURL command: 

    curl -H "content-type:application/json" -X POST --data '{"name":"New School Name"}' -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools/000000000000000000000000

Currently, school and user data can be added/edited via the API.  If you would like to add more, contact your friendly Whetstone Education CTO (Cody) and he'll open that up.

####Examples of data that can be sent via POST requests
**[School Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-POST-REQUEST-DATA/school.json)**: /api/v1/schools

**[User Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-POST-REQUEST-DATA/user.json)**: /api/v1/users

###Deleting Data
This is obviously a danger zone.  You probably shouldn't delete anything and, in fact, you can't completely delete anything in this way.  You can, however, set the archivedAt date for records using the API.  The easiest way to do that is to send an HTTP DELETE request to a school or user record's endpoint.  For instance, to archive (i.e., hide a user in the web interface) a school, you would use this cURL command:

    curl -H "content-type:application/json" -X DELETE -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" http://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v1/schools/000000000000000000000000

You can also archive a user while editing their data by setting the archivedAt field to a JavaScript-style date format that looks like this: 2015-07-11T20:02:12-05:00 but we recommend doing it with a DELETE request, which automatically sets the timestamp.

###Examples and Help

We also have [example scripts](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts) to get you started. We have provided a cross-platform Node.js script, a Windows PowerShell script, and a bash script that should run on Mac and Linux. If you have an example script in another language, please make a pull request. The more examples we have, the more useful this API will be.  And if you develop any cool tools using this API, please consider open-sourcing it so other schools can benefit. 