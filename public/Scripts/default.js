
var socket = io();

socket.on('addimage', function (data, image) {
    $('#conversation').append($('<p>').append($('<b>').text(data + ':'), '<a class="chatLink" href="' + image + '">' + '<img src="' + image + '"/></a>'));
    scrollTopdown();
});
socket.on('otherformat', function (data, base64file) {
    $('#conversation').append($('<p>').append($('<b>').text(data + ':'), '<a href="' + base64file + '">Attachment File</a>'));
    scrollTopdown();
});


$(document).ready(function () {
    socket = io.connect('http://localhost:1234');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    $('#datasend').click(sendMessage);
    $('#data').keypress(processEnterPress);
    $('#dropZone').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

//--------------------------------------------------------------------------------------------------------------------------------------------------------------

$('#imagefile').on('change', function (e) {
    var file = e.originalEvent.target.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
        socket.emit('user image', evt.target.result);
    };
    reader.readAsDataURL(file);
    $('#imagefile').val('');
});

$('#otherfile').on('change', function (e) {
    var file = e.originalEvent.target.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
        socket.emit('other file', evt.target.result);
    };
    reader.readAsDataURL(file);
    $('#otherfile').val('');
});

//-------------------------------------------------------------------------------------------------------------------

    dropZone.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        for (var i = 0, file; file = files[i]; i++) {
            if (file.type.match(/image.*/)) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    socket.emit('user image', e.target.result);
                };
                reader.readAsDataURL(file);
                $('#dropZone').val('');

            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    socket.emit('other file', e.target.result);
                };
                reader.readAsDataURL(file);
                $('#dropZone').val('');
            }
        }
    });
});

//-----------------------------------------------------------------------------------------------------------


function addUser() {
    socket.emit('adduser', prompt("Enter Your Name!"));
}

function processMessage(username, data) {
    $('<b>' + username + ':</b> ' + data + '<br/>').insertAfter($('#conversation'));
    scrollTopdown();
}

function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<div>' + key + '</div>');
    });
}

function sendMessage() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
    $('#data').focus();
    scrollTopdown();
}

function processEnterPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#datasend').focus().click();
    }
}

function scrollTopdown(){
    var scrollhight = document.getElementById('conversation').scrollHeight;
    document.getElementById('conversation').scrollTop = scrollhight;
}
