'use strict';

var _Tweet = require('./models/Tweet');

var _Tweet2 = _interopRequireDefault(_Tweet);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _elasticHandler = require('./elasticHandler');

var _elasticHandler2 = _interopRequireDefault(_elasticHandler);

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var elastic_client = new _elasticsearch2.default.Client({
    hosts: [{
        protocol: 'https',
        host: _config2.default.es.host,
        port: 443
    }
    // ,
    // {
    //     host: 'localhost',
    //     port: 9200
    // }
    ]
});

//Handles the twitter stream data, and socket io obj avail
module.exports = function (stream, io) {
    var writableStream = _fs2.default.createWriteStream('../tweets.txt');

    stream.on('data', function (data) {
        //tweet obj
        var tweet = {
            author: _lodash2.default.get(data, 'user.name'),
            avatar: _lodash2.default.get(data, 'user.profile_image_url'),
            body: _lodash2.default.get(data, 'text'),
            date: _lodash2.default.get(data, 'created_at'),
            screenname: _lodash2.default.get(data, 'user.screen_name'),
            favs: _lodash2.default.get(data, 'favorite_count'),
            retweets: _lodash2.default.get(data, 'retweet_count'),
            loc_name: _lodash2.default.get(data, 'place.full_name'),
            loc_lat: _lodash2.default.get(data, 'coordinates.coordinates[1]') || _lodash2.default.get(data, 'geo.coordinates[0]'),
            loc_lon: _lodash2.default.get(data, 'coordinates.coordinates[0]') || _lodash2.default.get(data, 'geo.coordinates[1]')
        };
        console.log(tweet);
        // if (tweet.loc_lat && tweet.loc_lon) console.log(tweet);

        // let tweetEntry = new Tweet(tweet);
        // Save 'er to the database
        if (tweet.loc_lat && tweet.loc_lon || tweet.loc_name) {
            io.emit('tweet', tweet);
            (0, _elasticHandler2.default)(elastic_client, io, tweet);
            // tweetEntry.save(function(err) {
            //     if (!err) {
            //         // If everything is cool, socket.io emits the tweet.
            //         console.log('tweet saved');
            //         //io.broadcast.emit('tweet', tweet);
            //         io.emit('tweet', tweet);
            //         //Write to File
            //         // writableStream.write(tweet.body);
            //     }
            // });
        }
    });
};
//# sourceMappingURL=streamHandler.js.map