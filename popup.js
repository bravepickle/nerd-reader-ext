window.addEventListener('load', function () {
    var widthEl = document.getElementById('f_input_width');
    var heightEl = document.getElementById('f_input_height');
    var pasteBtn = document.getElementById('paste_btn');
    var pasteCleanBtn = document.getElementById('paste_clean_btn');
    var editContentBtn = document.getElementById('edit_content_btn');
    var readEl = document.getElementById('read_content');
    readEl.contentEditable = false;

    widthEl.addEventListener('change', function () {
        document.getElementById('f_output_width').innerHTML = this.value + ' px';
        document.getElementsByClassName('content')[0].style.width = this.value - 30 + 'px';
    });

    heightEl.addEventListener('change', function () {
        document.getElementById('f_output_height').innerHTML = this.value + ' px';
        document.getElementsByClassName('content')[0].style.height = this.value - 30 + 'px';
    });

    document.forms[0].addEventListener('submit', function () {
        sessionStorage.setItem('read_content', readEl.innerHTML);
        window.open('window.html#' + widthEl.value + "," + heightEl.value, 'Nerd Book', "location=no,width=" + widthEl.value + ",height=" + heightEl.value + ",scrollbars=yes");

        return false;
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
});