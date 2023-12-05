const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1715498",
    key: "85de58124b369482bbb6",
    secret: "508f86ff9111bb432692",
    cluster: "us2",
    useTLS: true
});

module.exports = pusher;