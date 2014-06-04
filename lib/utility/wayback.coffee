Firebase = require("firebase")
phantom = require("phantom")
email = require("../../node_modules/emailjs")
waybackUrl = 'http://archive.org/wayback/available?url='
request = require('request')
url = require('url')
moment = require('moment')

dates = []
for num in [1..5]
  dates.push moment().subtract('days', 7 * num).format('YYYYMMDD')

console.log(dates)

#connect to firebase
db = new Firebase("https://kiwidb.firebaseio.com/")
db.auth process.env.CRAWLER_AUTH, -> #db.auth throws errors, no need for us to do it

#connect to email smtp server
server = undefined
connect = -> #connects to email server
  server = email.server.connect(
    user: "thekiwioverlord"
    password: "kiwisforlife"
    host: "smtp.gmail.com"
    ssl: "true"
  )
  return

connect()

#declare functions necessary for required phantom activity
getText = ($node, target) ->
  $node.text()

getTodayInString = ->
  today = new Date()
  today.toString()

warnUser = (email, url, name) -> #sends email to user
  server.send
    text: "Hey " + name + ", our kiwi runner noticed a kiwi of yours tracking " + url + " got lost. We won't be able to track this one. We're not spammers so you won't get any more messages about lost kiwis."
    from: "thekiwioverlord@gmail.com"
    to: email
    subject: "One of your kiwis got lost"
  , (err, message) ->
    console.log err or message
    return

  return


#declare objects to hold kiwis that need updating
dispatch = {} #stores info about deployed phantoms
queue = [] #stores queue of kiwis for updating
dispatch.counter = 0 #maintains number of kiwis not updated. Program exits when this is 0 again.
dataSet = {} #stores metadata kiwis. Used to populate the queue
warnings = 0 #stores number of warning emails sent

#declare functions for populating above objects. Called after firebase sends data
populateQueue = ->
  for user of dataSet
    kiwiList = dataSet[user].kiwis
    for kiwi of kiwiList
      queue.push kiwiList[kiwi]
  console.log queue.length + " kiwis to crawl."
  return


#declare functions to manage phantom scraping activity
updateAirTraffic = ->
  if (dispatch.counter < 4) and queue[queue.length - 1] #maintains maximum four phantoms
    dispatch.counter++
    console.log "Dispatched " + dispatch.counter + " phantoms. Now fetching kiwi at " + queue[queue.length - 1].destination
    console.log queue.length - 1 + " kiwis remaining. " + warnings + " warnings issued."
    phantomFetchWayback queue.pop() #DEFINED AT END OF THIS FILE
  return

activateDispatch = -> #sends out a phantom when the fourth one returns.
  setInterval (->
    updateAirTraffic()
    return
  ), 200
  return


#this block will populate the dataSet object. Above two functions then decide how to dispatch phantoms.
db.once "value", (snapshot) ->
  console.log "Firebase connection established."
  snapshot.forEach (item) ->
    for user of item.val()
      dataSet[user] = {} #object to store user and associated kiwis
    for user of dataSet
      count = Object.keys(item.val()[user].kiwis).length
      if count is 1
        dataSet[user].notified = item.val()[user].settings.notified
        dataSet[user].email = item.val()[user].settings.email
        dataSet[user].name = item.val()[user].settings.name
        dataSet[user].kiwiPath = "https://kiwidb.firebaseio.com/users/" + user + "/kiwis" #url to user's kiwis
        dataSet[user].firebase = new Firebase(dataSet[user].kiwiPath) #firebase listener on user's kiwi collection
        dataSet[user].kiwis = {} #to store kiwis, and their associated urls and paths
        dataSet[user].firebase.once "value", ((snapshot) -> #for each kiwi in the user's collection
          for kiwi of snapshot.val() #sets relevant info for each kiwi in dataset
            user = @user
            kiwiUrl = snapshot.val()[kiwi].url
            parsed = url.parse(kiwiUrl)
            collectedDates = {}
            for date in dates
              smega = waybackUrl + parsed.hostname + parsed.pathname.match(/.*\//g)[0] + '&timestamp' + date
              console.log smega
              request smega, (err, res, body) ->
                result = JSON.parse(body);
                archived = result.archived_snapshots.closest
                isAvailable = archived.available
                timestamp = archived.timestamp
                waybackPath = archived.url
                if(archived.available)
                  if not collectedDates[timestamp]
                    collectedDates[timestamp] = archived.url
                    console.log(JSON.parse(body))
                  # console.log(body);
                    dataSet[user].kiwis[kiwi] =
                      name: dataSet[user].name
                      user: user
                      email: dataSet[user].email
                      notified: dataSet[user].notified
                      path: snapshot.val()[kiwi].path
                      url: waybackPath
                      destination: dataSet[user].kiwiPath + "/" + kiwi + "/values"
          return
        ), user: user #end inner once. Note context object passed in here.

    return

  #end for loop
  #end foreach
  setTimeout (-> #wait some seconds then start dispatching phantoms
    populateQueue()
    activateDispatch()
    return
  ), 5000
  return

#end once

#closing routine for phantom. Procedure for clean exit sans orphan phantom processes. 
shutDown = (passedIn, phantom) ->
  dispatch.counter--
  if dispatch.counter is 0
    setTimeout (->
      process.exit()
      return
    ), 8000 #allow phantoms time to exit and end processes. reduces risk of memory leak.
  phantom.exit()
  return


#phantom routine
phantomFetchWayback = (kiwi) ->
  phantom.create (ph) ->
    ph.createPage (page) ->
      page.open kiwi.url, (status) ->
        page.includeJs "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", ->
          page.evaluate ((kiwi) ->
            $ = jQuery  if not $ and jQuery
            text = $(kiwi.path).text().trim() #fetch user's element from page
            #populate return object; required for logical actions in callback
            user: kiwi.user
            text: text
            url: kiwi.url
            path: kiwi.path
            name: kiwi.name
            email: kiwi.email
            notified: kiwi.notified
            destination: kiwi.destination
          
          #CALLBACK
          ), ((result) ->
            console.log('result', result);
            if result.text.length < 1 and result.notified is "false" #bad data: email user and exit phantom
              warnings++
              warnUser result.email, result.url, result.name
              settingsRef = new Firebase("https://kiwidb.firebaseio.com/users/" + result.user + "/settings")
              settingsRef.update
                notified: "true"
              , ->
                shutDown null, ph
                return

            else if result.text.length < 1 #bad data: User already informed. Just exit phantom
              shutDown null, ph
            else #good data. write to firebase and exit phantom.
              dataRef = new Firebase(result.destination)
              # dataRef.push
              #   date: getTodayInString()
              #   value: result.text
              # , ->
              #   shutDown null, ph
              #   return

            return
          ), kiwi
          return

        return

      return

    return

  return
