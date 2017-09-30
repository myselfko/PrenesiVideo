var request = require('request');
var moment = require('moment');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

function videoRTVSlo(url, callback) {
    request('http://api.rtvslo.si/ava/getRecording/' + url.split("/").slice(-1)[0] + '?client_id=82013fb3a531d5414f478747c1aca622', function (error, res, body) {
        if (error) {
            callback(error, null);
        } else {
            var json = JSON.parse(body);
            var len = json.response.mediaFiles.length - 1;
            callback(null, json.response.mediaFiles[len].streamers.http + '/' + json.response.mediaFiles[len].filename);
        }
    });
}

function video24ur(url, callback) {
    request(url, function (error, res, body) {
        if (error) {
            callback(error, null);
        } else {
            var media_id = body.match(/media_id = \"(.*?)\"/)[1];
            var section_id = body.match(/section_id = \"(.*?)\"/)[1];
            var url = 'http://gql.24ur.si/graphql?query=%7BvideoHlsUrl(id%3A%20' + media_id + ' siteId:1 sectionId:' + section_id + ')%20%7Burl%7Dvideo(id%3A' + media_id + ')%7Bimages%7Bhref%7D%7D%7D';
            request(url, function (error, res, body) {
                var json = JSON.parse(body);
                console.log(json.errors);
                if (error || json.errors) {
                    callback(error || json.errors, null);
                } else {
                    var param = json.data.videoHlsUrl.url.split("/");
                    var date = moment.unix(param[5]*1 + 3600*24).utc().format('YYYY/MM/DD');
                    callback(null, 'http://vid01.24ur.com/' + date + '/' + param[6] + '-2.mp4');
                }
            });
        }
    });
}

function sendURL(error, video_url, res) {
    if (error) {
        res.send('ERROR');
    } else {
        res.send(video_url);
    }
}

app.post('/', function (req, res) {
    var url = req.body.url.toLowerCase();
    if (url.indexOf('rtvslo.si') != -1) {
        videoRTVSlo(url, function (error, video_url) {
            sendURL(error, video_url, res);
        });
    } else if (url.indexOf('24ur.com') != -1) {
        video24ur(url, function (error, video_url) {
            sendURL(error, video_url, res);
        });
    }
});

app.get('/', function(req, res) {
    res.redirect('https://myselfko.github.io/PrenesiVideo/');
});

app.listen(80);