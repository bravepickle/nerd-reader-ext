window.addEventListener('load', function () {
    // var dimensions = top.location.hash.split(',');
    // var isPopup = dimensions.length == 2; // true when is popup window is opened
    // if (isPopup) {
    //     window.resizeTo(dimensions[0], dimensions[1]);
    // }

    // var widthEl = document.getElementById('f_input_width');
    // var heightEl = document.getElementById('f_input_height');
    var fontFamilyEl = document.getElementById('f_font_family');
    var fontSizeEl = document.getElementById('f_font_size');
    var fontColorEl = document.getElementById('f_font_color');
    var backgroundColorEl = document.getElementById('f_back_color');
    var readEl = document.getElementById('read_content');
    var hideBtn = document.getElementById('hide_btn');
    var showBtn = document.getElementById('show_btn');

    fontFamilyEl.addEventListener('change', function () {
        readEl.style.fontFamily = '"' + this.value + '", "Courier New", "Times New Roman"';
    });

    fontSizeEl.addEventListener('change', function () {
        readEl.style.fontSize = this.value + 'px';
    });

    fontColorEl.addEventListener('change', function () {
        readEl.style.color = this.value;
    });

    backgroundColorEl.addEventListener('change', function () {
        readEl.style.backgroundColor = this.value;
    });

    hideBtn.addEventListener('click', function () {
        document.forms[0].style.display = 'none';
        showBtn.style.display = 'inline';
    });

    showBtn.addEventListener('click', function () {
        document.forms[0].style.display = 'block';
        this.style.display = 'none';
    });


});