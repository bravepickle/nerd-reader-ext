window.addEventListener('load', function () {
    var registrySvc = new registry();

    registrySvc.add(contentSvc);
    registrySvc.add(editorPanelSvc);
    registrySvc.add(fontSvc);
    registrySvc.add(backgroundSvc);
    registrySvc.add(storageSvc);
    registrySvc.add(stylesSvc);
    registrySvc.add(clipboardSvc);

    registrySvc.runAll();

    // var fontFamilyEl = document.getElementById('f_font_family');
    // var fontSizeEl = document.getElementById('f_font_size');
    // var fontColorEl = document.getElementById('f_font_color');
    // var backgroundColorEl = document.getElementById('f_back_color');
    // var readEl = document.getElementById('read_content');
    // var hideBtn = document.getElementById('hide_btn');
    // var showBtn = document.getElementById('show_btn');
    // var saveBtn = document.getElementById('save_btn');
    // var pasteBtn = document.getElementById('paste_btn');
    // var pasteCleanBtn = document.getElementById('paste_clean_btn');
    // var editContentBtn = document.getElementById('edit_content_btn');
    // var editRawContentBtn = document.getElementById('edit_raw_content_btn');
    // var fontColorPicker = document.getElementById('font_color_picker');
    // var backgroundColorPicker = document.getElementById('back_color_picker');
    // var cssBtn = document.getElementById('css_btn');
    // var cssStylesEl = document.getElementById('custom_css');
    // var cssStylesEditorEl = document.getElementById('custom_css_editor');
    //
    // readEl.contentEditable = false;
    // cssStylesEditorEl.contentEditable = true;
    //
    // // pass content from popup to window reader
    // if (sessionStorage.getItem('read_content')) {
    //     readEl.innerHTML = sessionStorage.getItem('read_content');
    //     sessionStorage.removeItem('read_content'); // clear buffer
    // } else if (localStorage.getItem('read_content')) {
    //     readEl.innerHTML = localStorage.getItem('read_content'); // show last saved
    // }
    //
    // if (localStorage.getItem('css_content')) {
    //     cssStylesEl.innerHTML = localStorage.getItem('css_content');
    // }
    //
    // fontFamilyEl.addEventListener('change', function () {
    //     readEl.style.fontFamily = '"' + this.value + '", "Courier New", "Times New Roman"';
    // });
    //
    // fontSizeEl.addEventListener('change', function () {
    //     readEl.style.fontSize = this.value + 'px';
    //     readEl.setAttribute( 'style', 'font-size: ' + this.value + 'px !important' );
    // });
    //
    // fontColorEl.addEventListener('change', function () {
    //     readEl.style.color = this.value;
    //     fontColorPicker.style.backgroundColor = this.value;
    // });
    //
    // backgroundColorEl.addEventListener('change', function () {
    //     readEl.style.backgroundColor = this.value;
    //     backgroundColorPicker.style.backgroundColor = this.value;
    // });
    //
    // hideBtn.addEventListener('click', function () {
    //     document.forms[0].style.display = 'none';
    //     showBtn.style.display = 'inline';
    // });
    //
    // showBtn.addEventListener('click', function () {
    //     document.forms[0].style.display = 'block';
    //     this.style.display = 'none';
    // });
    //
    // pasteBtn.addEventListener('click', function () {
    //     triggerEditContent();
    //     readEl.focus();
    //     readEl.innerHTML = '';
    //     document.execCommand('paste');
    //     triggerEditContent();
    // });
    //
    // pasteCleanBtn.addEventListener('click', function () {
    //     triggerEditContent();
    //     readEl.focus();
    //     readEl.innerHTML = '';
    //     document.execCommand('paste');
    //     readEl.innerHTML = readEl.innerText;
    //     triggerEditContent();
    // });
    //
    // function triggerEditContent() {
    //     if (readEl.contentEditable == 'false') {
    //         readEl.contentEditable = true;
    //         readEl.style.border = '1px solid red';
    //         readEl.focus();
    //         editContentBtn.innerHTML = 'Stop Editing';
    //
    //         // avoid misuse of editor
    //         pasteCleanBtn.disabled = true;
    //         pasteBtn.disabled = true;
    //         editRawContentBtn.disabled = true;
    //         cssBtn.disabled = true;
    //         saveBtn.disabled = true;
    //     } else {
    //         readEl.contentEditable = false;
    //         readEl.style.border = 'none';
    //         editContentBtn.innerHTML = 'Edit Content';
    //
    //         pasteCleanBtn.disabled = false;
    //         pasteBtn.disabled = false;
    //         editRawContentBtn.disabled = false;
    //         cssBtn.disabled = false;
    //         saveBtn.disabled = false;
    //     }
    // }
    //
    // function triggerEditRawContent() {
    //     var buf;
    //
    //     if (readEl.contentEditable == 'false') {
    //         readEl.contentEditable = true;
    //         readEl.style.border = '1px dashed red';
    //         readEl.focus();
    //         editRawContentBtn.innerHTML = 'Stop Editing';
    //
    //         buf = readEl.innerHTML;
    //         readEl.innerText = buf;
    //
    //         // avoid misuse of editor
    //         pasteCleanBtn.disabled = true;
    //         pasteBtn.disabled = true;
    //         saveBtn.disabled = true;
    //         editContentBtn.disabled = true;
    //         cssBtn.disabled = true;
    //     } else {
    //         readEl.contentEditable = false;
    //         readEl.style.border = 'none';
    //         editRawContentBtn.innerHTML = 'Edit Raw Content';
    //
    //         buf = readEl.innerText;
    //         readEl.innerHTML = buf;
    //
    //         pasteCleanBtn.disabled = false;
    //         pasteBtn.disabled = false;
    //         saveBtn.disabled = false;
    //         editContentBtn.disabled = false;
    //         cssBtn.disabled = false;
    //     }
    // }
    //
    // editContentBtn.addEventListener('click', triggerEditContent);
    // editRawContentBtn.addEventListener('click', triggerEditRawContent);
    //
    // document.body.onkeyup = function (ev) {
    //     if (ev.code == 'Escape') {
    //         var neo = new Event('click');
    //
    //         if (showBtn.style.display != 'none') {
    //             showBtn.dispatchEvent(neo);
    //         } else {
    //             hideBtn.dispatchEvent(neo);
    //         }
    //     }
    // };
    //
    // saveBtn.addEventListener('click', function() {
    //     localStorage.setItem('read_content', readEl.innerHTML);
    //     localStorage.setItem('css_content', cssStylesEl.innerHTML);
    // });
    //
    // cssBtn.addEventListener('click', function() {
    //     if (cssStylesEditorEl.style.display != 'block') {
    //         cssStylesEditorEl.innerText = cssStylesEl.innerHTML;
    //         cssStylesEditorEl.style.display = 'block';
    //         cssStylesEditorEl.focus();
    //         this.innerHTML = 'Close CSS editor';
    //         readEl.style.display = 'none';
    //
    //         // avoid misuse of editor
    //         pasteCleanBtn.disabled = true;
    //         pasteBtn.disabled = true;
    //         saveBtn.disabled = true;
    //         editContentBtn.disabled = true;
    //         editRawContentBtn.disabled = true;
    //     } else {
    //         cssStylesEl.innerHTML = cssStylesEditorEl.innerText;
    //         cssStylesEditorEl.style.display = 'none';
    //         this.innerHTML = 'Edit CSS';
    //         readEl.style.display = 'block';
    //         // avoid misuse of editor
    //         pasteCleanBtn.disabled = false;
    //         pasteBtn.disabled = false;
    //         saveBtn.disabled = false;
    //         editContentBtn.disabled = false;
    //         editRawContentBtn.disabled = false;
    //     }
    // });
});