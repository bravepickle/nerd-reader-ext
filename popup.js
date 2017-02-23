window.addEventListener('load', function () {
    var widthEl = document.getElementById('f_input_width');
    var heightEl = document.getElementById('f_input_height');

    widthEl.addEventListener('change', function () {
        document.getElementById('f_output_width').innerHTML = this.value + ' px';
        document.getElementsByClassName('content')[0].style.width = this.value - 30 + 'px';
    });

    heightEl.addEventListener('change', function () {
        document.getElementById('f_output_height').innerHTML = this.value + ' px';
        document.getElementsByClassName('content')[0].style.height = this.value - 30 + 'px';
    });

    document.forms[0].addEventListener('submit', function () {
        window.open('window.html#' + widthEl.value + "," + heightEl.value, 'Nerd Book', "location=no,width=" + widthEl.value + ",height=" + heightEl.value + ",scrollbars=yes");

        return false;
    });
});