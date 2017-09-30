var now_server = 'https://prenesivideo-yvfmapgpuu.now.sh';

$(document).ready(function () {
    $('.primer').click(function (e) {
        $('#video-url').val(e.target.innerText);
        $('#prenesi').click();
    });

    $('#prenesi').click(function () {
        var url = $('#video-url').val();
        if (!url) {
            $('#video-url').removeClass('animated jello').addClass('animated jello').one('webkitAnimationEnd oAnimationEnd', function () {
                $(this).removeClass('animated jello');
            });
            return;
        }

        $('#loader').show();
        $('#video-url').val('');
        $.post(now_server, {url: url}, function(data) {
            if (data != 'ERROR') {
                window.location = data;
            } else {
                $('#loader').hide();
                $.notify({
                    url: 'https://github.com/myselfko/PrenesiVideo/issues',
                    target: '_blank',
                    message: '<b>Pri pridobivanju videa je prišlo do težave!</b><br />Težave lahko prijavite s klikom na to sporočilo.',
                },{
                    type: 'danger'
                });
            }
        });
    });
});