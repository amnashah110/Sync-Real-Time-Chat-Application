$(document).ready(function () {
    /*global io*/
    let socket = io();

    function scrollToBottom() {
        const messages = document.getElementById('messages');
        messages.scrollTop = messages.scrollHeight;
    }

    socket.on('user', data => {
        $('#num-users').text('Users Online: ' + data.currentUsers);
        let message =
            data.username +
            (data.connected ? ' has joined the chat.' : ' has left the chat.');
        $('#messages').append($('<li>').addClass('user-status').html('<b>' + message + '</b>'));
    });

    socket.on('chat message', data => {
        console.log('socket.on 1');
        const $messageItem = $('<li>').addClass('chat-message');
        const $username = $('<span>').addClass('username').text(`${data.username}: `);
        const $message = $('<span>').addClass('message').text(data.message);
        $messageItem.append($username).append($message);
        $('#messages').append($messageItem);
        scrollToBottom();
    });
    

    // Form submission with new message in field with id 'm'
    $('form').not('#logout-form').submit(function () {
        let messageToSend = $('#m').val();
        // Send message to server here
        socket.emit('chat message', messageToSend);
        $('#m').val('');
        return false; // prevent form submit from refreshing page
    });
});
