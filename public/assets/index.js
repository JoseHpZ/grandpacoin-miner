(d => {
    document.addEventListener('click', clickhandler);

    function clickhandler(e) {
        if (e.target.id && e.target.id === 'start-miner') {
            if (d.getElementById('stop-miner').classList.contains('active'))
                d.getElementById('stop-miner').classList.remove('active');
            e.target.classList.add('active');

            fetch('http://localhost:2000/job/start').then(res => res.json())
            .catch(err => {
                removeActiveOnFail(e.target);
            });
        }
        if (e.target.id && e.target.id === 'stop-miner') {
            if (d.getElementById('start-miner').classList.contains('active'))
                d.getElementById('start-miner').classList.remove('active');
            e.target.classList.add('active');

            const logContainer = d.getElementsByClassName('log-container')[0];
            logContainer.insertAdjacentHTML('beforeend', `<p>Stopping Miner.</p>`);
            logContainer.children[logContainer.children.length - 1].scrollIntoView();

            fetch('http://localhost:2000/job/stop').then(res => res.json())
            .catch(err => {
                removeActiveOnFail(e.target);
            });
        }
        if (e.target.id && e.target.id === 'clear-log') {
            Array.prototype.slice.call(d.getElementsByClassName('log-container')[0].children).forEach(child => child.remove())
        }
    }
    function removeActiveOnFail(target) {
        if (target.classList && target.classList.contains('active')) {
            target.classList.remove('active');
        }
    }
})(document)