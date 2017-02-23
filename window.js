window.addEventListener('load', function () {
    var fontFamilyEl = document.getElementById('f_font_family');
    var fontSizeEl = document.getElementById('f_font_size');
    var fontColorEl = document.getElementById('f_font_color');
    var backgroundColorEl = document.getElementById('f_back_color');
    var readEl = document.getElementById('read_content');
    var hideBtn = document.getElementById('hide_btn');
    var showBtn = document.getElementById('show_btn');
    var pasteBtn = document.getElementById('paste_btn');
    var pasteCleanBtn = document.getElementById('paste_clean_btn');
    var editContentBtn = document.getElementById('edit_content_btn');

    readEl.contentEditable = false;

    // pass content from popup to window reader
    if (sessionStorage.getItem('read_content')) {
        readEl.innerHTML = sessionStorage.getItem('read_content');
    }

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

    pasteBtn.addEventListener('click', function () {
        triggerEditContent();
        readEl.focus();
        readEl.innerHTML = '';
        document.execCommand('paste');
        triggerEditContent();
    });

    pasteCleanBtn.addEventListener('click', function () {
        triggerEditContent();
        readEl.focus();
        readEl.innerHTML = '';
        document.execCommand('paste');
        readEl.innerHTML = readEl.innerText;
        triggerEditContent();
    });

    function triggerEditContent() {
        if (readEl.contentEditable == 'false') {
            readEl.contentEditable = true;
            readEl.style.border = '1px solid red';
            editContentBtn.innerHTML = 'Stop Editing';

            // avoid misuse of editor
            pasteCleanBtn.disabled = true;
            pasteBtn.disabled = true;
        } else {
            readEl.contentEditable = false;
            readEl.style.border = 'none';
            editContentBtn.innerHTML = 'Edit Content';
            pasteCleanBtn.disabled = false;
            pasteBtn.disabled = false;
        }
    }

    editContentBtn.addEventListener('click', triggerEditContent);

    document.body.onkeyup = function (ev) {
        if (ev.code == 'Escape') {
            var neo = new Event('click');

            if (showBtn.style.display != 'none') {
                showBtn.dispatchEvent(neo);
            } else {
                hideBtn.dispatchEvent(neo);
            }
        }
    };
});