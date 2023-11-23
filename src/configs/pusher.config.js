const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '',
    key: '',
    secret: '',
    cluster: '',
    useTLS: true
});

module.exports = pusher;