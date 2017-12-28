# Whetstone API

### Recent Updates
- Added an [example script](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts/NodeJSExample-LargeDataSets.js) for pulling data by month. This is especially useful for large networks who may experience timeout issues when pulling large data sets like observations or scores
- Added scores endpoint
- Added convenience fields to assignments 
- Added additional tagging endpoints
- Added ability to add, delete, and modify tagging fields 
- Added additional ID fields on references to users to make integration with other platforms easier. For instance, the "observer" and "teacher" fields on an observation will now include internalId, accountingId, powerSchoolId, and canvasId. If you'd like to populate our database with ID fields from other databases, check out the "Imports" feature in Whetstone or get in touch. We're happy to do an initial import to get those fields populated for existing users. 
- Draft observations are now available by adding {isPublished: 0} to an observation query.

### Changelog from v1

- Updated endpoint to /api/v2/endpoint
- Added 4 new endpoints (grades, meetings, meetingtypes, videos)
- Grades are now a customizable field and the API has been adjusted to reflect that. Some older data may have both grade and gradeLevel. In those instances, gradeLevel is the new version. The grade field will be removed in a future update.  
- Where possible, sub-fields have been populated.  For instance, if an observation is tagged, rather than returning an array of tag _id fields, the API now returns an array of tag objects.  This is likely a breaking change from v1 of the API for some scripts. It should allow for simplification and fewer joins on your end. (Version 1 of the API is deprecated but will remain available for the forseeable future.)
- Nearly all endpoints return additional data elements. 


### Pre-requisites
In order to access the API, you need a Whetstone account at the admin permission level.

### Introduction

There are two methods of connecting, Oauth 2 and using your API Key. Typically, the API Key is easier for scripting, while Oauth 2 will be required for GUI applications (including [Postman](https://www.getpostman.com), a user-friendly API testing app). 

#### API Key Method
The first step to accessing the API is to get your API key.  After logging into Whetstone, visit the settings page (click your name at the top right and choose "My Settings").  You should see a section called "Developer Options" section.  (If you don't, get in touch.  You may not have the correct permissions set up.)  

By default, your API key is hidden.  Click, "Show my API key" to reveal an alphanumeric hash key.  That's your personal key to access Whetstone data.  You can also generate a new API key by clicking "Generate New API Key." That invalidates the old key and creates a new one. 

Now that you have an API key, you can make an HTTP POST request with your key to our authentication endpoint to get a temporary access token.  We've got a handful of [example scripts](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts) (thank you to Andrew Cox of Renew Schools for the [R example](https://github.com/amcox/whetstone_api_r_demo)) available to get you started but If you're using cURL, you can run this command:

    curl -s --data "apikey=YOUR_API_KEY" https://YOUR_INSTANCE_NAME.whetstoneeducation.com/auth/api

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

#### Oauth 2 Method (Beta)
After logging into Whetstone, visit your settings page (click your name at the top right and choose "My Settings"). In the section called "Developer Options," you'll see a setting called "Approved Oauth2 Applications." Click the "Add a New Oauth Client" button and you'll be asked for the applicaton name you wish to authorize, an optional logo, and what scopes you'll want available. For the full API, you can use the api:all scope. (Whetstone can also act as an Oauth 2 SSO solution in other applications. If that's your end-goal, use that scope instead, as it's limited to basic user authentication.)

Once you've made your selections, you'll be provided the fields you need to set up Oauth 2: Auth URL, Access Token URL, Client ID, and Client Secret. You can then add them to your application or script. (For instance, in [Postman](https://www.getpostman.com), from the Builder tab, you would select "Oauth 2" for the type, and then click "Get New Access Token" to enter your credentials. Postman will then be authorized to make API requests.)

#####Important Oauth 2 Note: 
The URL for the Oauth 2 data URLs will look like this:

    https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/oauth2/v2/YOUR_ENDPOINT

The examples below use cURL and the API Key method, which has a different URL structure. So, make sure to add /oauth2 in the URL when making GET requests. 

### Getting Data from Whetstone - HTTP GET
Using the key and token, you can make GET requests to pull data.  Let's get the list of schools as an example.  The endpoint for schools data is:

    https://YOUR_INSTANCE.whetstoneeducation.com/api/v2/schools
    
To access data, you need to make an HTTP GET request with the *access-token* and *key* included in the headers. Using cURL, it would look like this.

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools

If everything checks out, you'll get back all the schools data in Whetstone's database in JSON format. 

When pulling data, there is a 30s limit. All requests taking longer than that will trigger a timeout error. If you encounter an error, the best course of action is to use query data in multiple requests and combine the data for further processing. We also have an [example NodeJS script](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts/NodeJSExample-LargeDataSets.js) showing how to pull a large amounts of data by month in order to avoid the 30s limit.

#### Querying Data
If you want to query the database, you can append a query string to your endpoint. In cURL, it would look like this:

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools?name=Bel+Air+Academy

In that example, you would request the record where the name of the school is equal to Bel Air Academy.  You can use any data field in the query string.

If you prefer XML over JSON, you can add a format: xml to the headers like this:

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" -H "format:xml" https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools?name=Bel+Air+Academy

If you want to query by date range, you can use the $gte or $lte (greater than or equal to) operators that, in JavaScript, would look like this:

    var queryString = {
      observedAt: {
        $gte: new Date(2015,3,1),
        $lte: new Date()
      }
    }

The equivalent query string encoded would be: 

    observedAt%5B%24gte%5D=2015-04-01T05%3A00%3A00.000Z&observedAt%5B%24lte%5D=2016-06-13T15%3A18%3A04.272Z

And in cURL, you'd request it like this:

    curl -H "content-type:application/json" -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY"  https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/observations?observedAt%5B%24gte%5D=2015-04-01T05%3A00%3A00.000Z&observedAt%5B%24lte%5D=2016-06-13T15%3A18%3A04.272Z

Our API seeks to mimic the MongoDB query language, which is JavaScript based. To learn more, visit the [MongoDB query documentation](https://docs.mongodb.com/manual/reference/operator/query/).

####Single Records by ID
If you want to access a record where you know the Whetstone _id field, you can make an HTTP GET request with the _id added to the endpoint.  For instance, to get a single school, you can use the endpoint: 

    https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools/000000000000000000000000 


#### Data Available via GET requests
We currently have the following primary endpoints available for HTTP GET requests:

**[School Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/schools.json)**: /api/v2/schools

**[User Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/users.json)**: /api/v2/users

**[User Data (SCIM compliant)](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/usersscim.json)**: /api/v2/usersscim

**[Action Step and Goal Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/assignments.json)**: /api/v2/assignments

**[Observation Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/observations.json)**: /api/v2/observations

**[Scores Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/scores.json)**: /api/v2/scores
*Note: scores are aslo included with observations*

**[Quick Feedback Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/informals.json)**: /api/v2/informals

**[Rubric Details](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/rubrics.json)**: /api/v2/rubrics

**[Measurement Details](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/measurements.json)**: /api/v2/measurements

**[Measurement Group Names](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/measurementGroups.json)**: /api/v2/measurementGroups

**[File Uploads](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/files.json)**: /api/v2/files

**[Meetings](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/meetings.json)**: /api/v2/meetings

**[Meetings](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/meetings.json)**: /api/v2/meetings

**[Videos](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/videos.json)**: /api/v2/videos

In addition, the following fields, primarily used for tagging, are available

**[Tags (System-wide)](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/tags.json)**: /api/v2/tags

**[Observation tag 1](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationtag1s

**[Observation tag 2](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationtag2s

**[Observation tag 3](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationtag3s

**[Observation tag 4](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationtag4s

**[Observation type](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationTypes

**[Observation module](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationModules

**[Observation label](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/observationLabels

**[Grade](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/grades

**[Course](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/courses

**[Collaboration type](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/collaborationtypes

**[Measurement group](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/measurementGroups

**[Measurement type](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/measurementTypes

**[Meeting module](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/meetingmodules

**[PLU Event Location](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/plueventlocations

**[PLU Event Type](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/plueventtypes

**[PLU Series](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/pluseriess

**[PLU Content Area](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/plucontentareas

**[Period](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/periods

**[Track](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/tracks

**[Video type](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/videotypes

**[Goal Type](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/goalTypes

**[Meeting tag 1](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/meetingtag1s

**[Meeting tag 2](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/meetingtag2s

**[Meeting tag 3](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/meetingtag3s

**[Meeting tag 4](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/meetingtag4s

**[Action Step Options](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/actionstepopts

**[Goal Options](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/goalopts

**[User tag 1](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag1s

**[User tag 2](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag2s

**[User tag 3](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag3s

**[User tag 4](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag4s

**[User tag 5](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag5s

**[User tag 6](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag6s

**[User tag 7](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag7s

**[User tag 8](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/usertag8s

**[Rubric tag 1](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/rubrictag1s

**[Rubric tag 2](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/rubrictag2s

**[Rubric tag 3](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/rubrictag3s

**[Rubric tag 4](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/rubrictag4s

**[Event Tag 1](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/generic.json)**: /api/v2/eventtag1s 

Examples of what kind of data you can expect are in the [EXAMPLE-GET-REQUEST-DATA](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-GET-REQUEST-DATA/) folder.  

### Sending Data to Whetstone
Pulling data is all well and good but what if you want to add, edit, or delete records?  That can be done through HTTP POST and DELETE requests.  Only a subset of our data can be written in the API. If something you want to add isn't available here, get in touch and we'll discuss opening it up.

#### Adding Data
So, let's say you want to add a new user.  The authentication aspect is the same as making a GET request.  (If you haven't tried that part of the tutorial, it's a good idea to do that first before you start creating records willy-nilly.)  You just need to POST JSON data you want to add to the same endpoint.  For instance, to add a user with this data:
    {
      "name":"Some Name",
      "email":"some.name@domain.org"
    }

you can make this cURL command:

    curl -H "content-type:application/json" -X POST --data '{"name":"Fake User","email":"fakeuser@email.com"}' -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/users
  
You'll probably want to add additional fields to your users when adding them but name and email are required.  

#### Editing Data

To edit a user already in the database, we use the same authentication process as above but make an HTTP POST request using the _id field. For a school, that would look like: 
  
    https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools/000000000000000000000000
  
So, to update a school's name, you would run the following cURL command: 

    curl -H "content-type:application/json" -X POST --data '{"name":"New School Name"}' -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools/000000000000000000000000

Currently, school and user data can be added/edited via the API.  If you would like to add more, contact your friendly Whetstone Education CTO (Cody) and he'll open that up.

#### Examples of data that can be sent via POST requests
**[School Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-POST-REQUEST-DATA/school.json)**: /api/v2/schools

**[User Data](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-POST-REQUEST-DATA/user.json)**: /api/v2/users

**[User Data (SCIM compliant)](https://github.com/WhetstoneEducation/API/blob/master/EXAMPLE-POST-REQUEST-DATA/userscim.json)**: /api/v2/usersscim


### Deleting Data
This is obviously a danger zone.  You probably shouldn't delete anything and, in fact, you can't completely delete anything in this way.  You can, however, set the archivedAt date for records using the API.  The easiest way to do that is to send an HTTP DELETE request to an endpoint.  For instance, to archive (i.e., hide in the web interface) a school, you would use this cURL command:

    curl -H "content-type:application/json" -X DELETE -H "x-access-token:YOUR_ACCESS_TOKEN" -H "x-key:YOUR_API_KEY" https://YOUR_INSTANCE_NAME.whetstoneeducation.com/api/v2/schools/000000000000000000000000

You can also archive while editing data by setting the archivedAt field to a JavaScript-style date format similar to this: 2015-07-11T20:02:12-05:00 but we recommend doing it with a DELETE request, which automatically sets the timestamp.


### Authenticating users
If you work with other vendors whose login system you trust, you can have them create links to log users into Whetstone directly from their authenticated area. Each user has a 24 bit "localkey" field that can be used in lieu of a password.  Keys expire at irregular intervals and should never be cached or bookmarked. In order for a user to login using their localkey, the vendor should use the API to retreive the user's record and send the user to a URL like this: 

    https://YOUR_INSTANCE_NAME.whetstoneeducation.com/auth/localkey?apikey=USERS_LOCAL_KEY&_id=USERS_WHETSTONE_ID

Bypassing normal authentication routes obviously has security implications. Whetstone has no control over third-party login systems and allowing another vendor to log people into Whetstone opens another path for data to be compromised. If you're looking for a Single-Sign-On solution, we also support OAUTH 2 and SAML. Those methods are often preferable to creating custom authentication methods. 

### Examples and Help

We also have [example scripts](https://github.com/WhetstoneEducation/API/blob/master/ExampleScripts) to get you started. We have provided a Node.js script (cross-platform), a Python Script (cross-platform), a Go script (cross-platform), a PowerShell script (Windows), and a bash script (OS X, Linux, Unix, and anywhere else bash and cURL can be found). 

If you have an example script in another language, please share it with us, either via email or by making a pull request and adding it (make sure to delete your API key!) If you develop any useful tools using this API, please consider open-sourcing it so other schools can benefit. 