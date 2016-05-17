/**
 * Created by Sarat Chandra on 5/17/2016.
 */

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var elasticsearch = require('elasticsearch');
var ES_client = new elasticsearch.Client({
    host: 'localhost:9200'          // default path
});

var Redis_client = require('redis');

function addDoc_ES(document){
    //console.log(document);
    return ES_client.index({
        index: "cloudboost",
        type: "messages",
        body: document
    });
}

function search_ES(to_match) {
    return ES_client.search({
        index: "cloudboost",
        type: "messages",
        q: to_match
    })
}

app.route('/index')
    .post(function(req,res){
        addDoc_ES(req.body).then(function(result){res.send(result)});
        console.log("Indexed message into ElasticSearch and Redis");
    })
    .get(function(req,res){
        console.log("Get data from Redis");
    });

app.get('/search', function(req,res){
    console.log("Searching from ElasticSearch for "+ req.query.str);
    search_ES(req.query.str).then(function (result) {
        var hits = result.hits.hits;
        res.send(hits);
    }, function (error) {
        console.trace(error.message);
    });
});

app.listen(7000, function(){
   console.log("API server started on port 7000 !");
});