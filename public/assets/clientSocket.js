
(d => {
    var socket = io('http://localhost:4000');
    
    socket.on('event', renderLogMessage);
    socket.on('disconnect', function(){});

    function renderLogMessage(res) {
        const logContainer = d.getElementsByClassName('log-container')[0];
        logContainer.insertAdjacentHTML('beforeend', `<p>${res.message}</p>`);
        logContainer.children[logContainer.children.length - 1].scrollIntoView();
    }
})(document)