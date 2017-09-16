
$(() => {
    $('.primer').click((e) => {
        $('#video-url').val(e.target.innerText);
        $('#prenesi').click();
    });

    $('#prenesi').click(() => {
        const url = $('#video-url').val().toLowerCase();
        $('#video-url').val('');
        if (url.indexOf('rtvslo.si') != -1) {
            getRTVSlo('https://api.rtvslo.si/ava/getRecording/' + url.split("/").slice(-1)[0] + '?client_id=82013fb3a531d5414f478747c1aca622');
        } else if (url.indexOf('24ur.com') != -1) {
            get24ur(url);
        }
    });
});

function getRTVSlo(url) {
    $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: json => {
            const len = json.response.mediaFiles.length - 1;
            window.location = json.response.mediaFiles[len].streamers.http + '/' + json.response.mediaFiles[len].filename;
        }
    });
}

function get24ur(url) {
    $.ajax({
        crossOrigin: true,
        url: url,
        success: function (data) {
            var media_id = data.match(/media_id = \"(.*?)\"/)[1];
            var section_id = data.match(/section_id = \"(.*?)\"/)[1];

            var url = 'https://gql.24ur.si/graphql?query=%7BvideoHlsUrl(id%3A%20' + media_id + ' siteId:1 sectionId:' + section_id + ')%20%7Burl%7Dvideo(id%3A' + media_id + ')%7Bimages%7Bhref%7D%7D%7D';
            $.getJSON(url, json => {
                var param = json.data.videoHlsUrl.url.split("/");
                var date = moment.unix(param[5]).format('YYYY/MM/DD');
                window.location = 'http://vid01.24ur.com/' + date + '/' + param[6] + '-2.mp4';
            });
        }
    });
}