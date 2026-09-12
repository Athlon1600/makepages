function updateTime() {
    const span = document.getElementById('current_time');

    const dateStr = (new Date()).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
    });

    span.innerHTML = dateStr;
}

(function () {

    updateTime();

    setInterval(() => {
        updateTime();
    }, 1050);

})();