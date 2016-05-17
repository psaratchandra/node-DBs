# cloudboost-task
NodeJS task for CloudBoost.io
Task to create two APIs and use them for data operations on ElasticSearch and Redis

## API 1 '/index'
### POST
This API takes in a sample message and indexes it into the ElasticSearch and Redis databases
Although a single simple message can be used to demonstrate, I have considered a scenario where the user sends a document with keys 'name' and 'message' with his/her name and message to be stored, respectively.
For Redis, I have chosen an ID counter for uniqueness of user's. This counter resets with every launch of the application.
Alternate method: To avoid this reset, this count can be stored in the Redis DB itself to maintain continuation. I wanted to keep it simple !

### GET
This route is used to get the data from the Redis DB. For this the user has to send a query with the parameter 'id' which corresponds to the user ID in the DB during creation.

## API 2 '/search'
### GET
This API is used to search for data from the ElasticSearch DB. To do so, the user can send the query with the 'str' parameter which can be a key:value pair or simple of string. The user can also send a GET request without any parameters to retrieve all the data in the ElasticSearch DB.

# Author
Sarat Chandra Pasumarthy