/**
 * Created by Sarat Chandra on 5/17/2016.
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var elasticsearch = require('elasticsearch');
// Connect to ES
var ES_client = new elasticsearch.Client({
    host: 'localhost:9200'          // default host and port
});

var redis = require('redis');
var Redis_client = redis.createClient(6379,'localhost'); //create a new Redis client with default port and host

// Connect to Redis Server
Redis_client.on('connect', function() {
    console.log('Connected to Redis server');
});

var count = 0; // For user IDs in Redis DB

// Function for adding data to ElasticSearch and Redis
function addDoc(document){
    //console.log(document);
    count++;

    Redis_client.hmset("user"+count, "name", document.name, "message", document.message,
        function (err) {if(err) console.log(err);}
    );

    return ES_client.index({
        index: "cloudboost",
        type: "messages",
        body: {
            name: document.name,
            message: document.message
        }
    });
}

// Function for searching data from ElasticSearch
function search_ES(to_match) {
    return ES_client.search({
        index: "cloudboost",
        type: "messages",
        q: to_match
    })
}

// API route '/index' with POST and GET
app.route('/index')
    .post(function(req,res){
        // Store data into DBs
        console.log("Indexing message into ElasticSearch and Redis");
        addDoc(req.body).then(function(result){res.send(result)});
    })
    .get(function(req,res){
        // GET data from Redis based on user id
        console.log("Getting data for user"+req.query.id);
        var key = "user"+req.query.id;
        Redis_client.hgetall(key, function (error, result){
            if (error) res.send('Error ' + error);
            else res.send(result);
        });
    });

// API '/search' with GET for searching data from ES
app.get('/search', function(req,res){
    console.log("Searching from ElasticSearch for "+ req.query.str);
    search_ES(req.query.str).then(function (result) {
        var hits = result.hits.hits;
        res.send(hits);
    }, function (error) {
        console.trace(error.message);
    });
});

// Start Express server on specified port
app.listen(7000, function(){
   console.log("API server started on port 7000 !");
});