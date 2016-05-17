/**
 * Created by Sarat Chandra on 5/17/2016.
 */

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var ES_client = require('elasticsearch');

var Redis_client = require('redis');

app.route('/index')
    .post(function(req,res){
       console.log("Indexed message into ElasticSearch and Redis");
    })
    .get(function(req,res){
        console.log("Get data from Redis");
    });

app.get('/search', function(req,res){
   res.send("Search data from ElasticSearch");
});

app.listen(7000, function(){
   console.log("API server started on port 7000 !");
});