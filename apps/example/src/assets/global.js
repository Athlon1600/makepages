function updateTime() {
    const span = document.getElementById('current_time');
    span.innerHTML = (new Date()).toLocaleString();
}

(function () {

    updateTime();

    setInterval(() => {
        updateTime();
    }, 1050);

})();