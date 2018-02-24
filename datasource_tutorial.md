### Initial Structure ###

First copy one of the example datasources to a new directory called the name of
the datasource you are creating. e.g. `cp -R reddit-basic-votes
wikipedia-dwell-time`. Move into this directory and you will see the three
files you need to create to make your datasource: manifest.json, schema.json
and plugin.js:

 - `manifest.json`:
   - This file contains metadata concerning your new datasource.
   - `name`:
     - This is the name of your datasource. It needs to match the directory
       name the datasource lies in.
   - `author`:
     - Your username.
   - `description`:
     - This should be a description of what exact data your datasource gathers.
     - It needs to be easily understandable, containing no technical terms that
       an average user wouldn't understand. Think about how you would explain
       what the datasource does to your grandparents!
     - See the example datasources for some good descriptions.
   - `version`:
     - What version of the datasource this is. General structure of `major
       release number.minor release number.maintenance release number` applies.
   - `sites`:
     - This is a list of regex-like strings which lays out what URLs the
       datasource will run on.
     - TODO: Explain format well.

 - `schema.json`:
   - This file contains the JSON object you will be asking Metro to send.
   - It must be a plain (i.e. not nested) JSON dictionary where the keys match
     the keys of the JSON object you ask Metro to send.

 - `plugin.js`:
   - This file is where the code to gather the data lives. It must contain one
     function, `initDataSource(metroClient)` which is the entry point of your
code.
   - This `metroClient` object is detailed below.


### First Steps ###

After making your schema and manifest files, you want to start on your plugin.
First you should start with a simple `initDataSource` with a log statement to
verify your plugin is running:

```
function initDataSource(metroClient) {
  console.log("Datasource running!");
}
```

You have two options at this point, you can push this initial branch of code to
your fork of the project or you can run a simple HTTP server locally. You just
need this code to be accessible via a HTTP call.
 - Testing from a fork:
   - This is the easiest way. First commit your code and push it to somewhere
     publicly accessible. In this case, github.
   - Then navigate to the RAW version of your source file. e.g.
     `https://raw.githubusercontent.com/RoryOfByrne/MetroDataSources/wikipedia-dwell-time/datasources/wikipedia-dwell-time/plugin.js`.
   - Take this URL and remove the `plugin.js` part.
   - This should leave you with a base URL of `https://raw.githubusercontent.com/RoryOfByrne/MetroDataSources/wikipedia-dwell-time/datasources/wikipedia-dwell-time/`.
   - Paste this base URL into the input box in the Metro settings dev mode and
     hit enter.
   - Your Datasource should now be running!
 - Testing from localhost:
   - You shouldn't need any help if you want to do it this way! Make the
     datasource directory accessible over HTTP. I do this by running:
     `python -m http.server 8000` from the directory containing your datasource.
   - Now open the Metro settings dev mode view and type the URL to access it
     followed by enter. In my example, `http://127.0.0.1:8000/`

Open up the developer console by hitting `ctrl` + `shift` + `i` and you should
see that your datasource is loading and printing to the console when you visit
a page allowed by your manifest file.

### Gathering Some Data ###

For this simple example, we just want to gather dwell time information on
wikipedia pages. The specific datapoints we want are:
  - `Page Load` - The Unix time in ms of when the page was first loaded.
  - `Page Leave` - The Unix time in ms of when the page was left.
  - `URL` - The URL of the wikipedia page the user was on.

First we gather the page load time:
```
function initDataSource(metroClient) {
  let loadTime = (new Date).getTime();
  console.log("loadTime: "+loadTime);
}
```
Then we want to get the time when the user leaves the page:
```
window.addEventListener("beforeunload", function() {
  let leaveTime = (new Date).getTime();
  console.log("leaveTime: " + leaveTime);
});
```
And we want to get the URL of the page:
```
let URL = window.location.href;
console.log(URL);
```

Now we have all of our individual components, we want to make the datapoint
that Metro will send for us. To do this, we just need to make an object
matching the structure of the object we have made in the `schema.json` file:

```
let datapoint = {
  "loadTime": loadTime,
  "leaveTime": leaveTime,
  "URL": URL
}
```
and tell our `metroClient` to send it off!

```
metroClient.sendDatapoint(datapoint);
```

Metro should tell you that the datapoint is not being published as you are in
dev mode, but it should print out the datapoint that would be sent if the
datasource was approved. It should be a JSON escaped string similar to:
```
{"projects":"test-user","timestamp":1518027785026,"data":"{\"loadTime\":1518027785021,\"leaveTime\":1518027785024,\"URL\":\"https://en.wikipedia.org/wiki/Falcon_Heavy\"}"}
```

Congratulations! You have made your first datasource! Now get creative!
