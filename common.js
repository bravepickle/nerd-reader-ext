// === Base class for services
var serviceObj = new function () {
    var self = this;
    self.name = 'NONAME'; // service name
    self.registry = null;
    self.contentSvc = null;

    self.getContentSvc = function () {
        if (!self.contentSvc) {
            self.contentSvc = self.findService('Content');
        }

        return self.contentSvc;
    };

    self.findService = function (name) {
        var svc = self.registry.get(name);
        if (!svc || typeof svc != 'object') {
            console.warn('Service is not initialized: ' + name);
            return null;
        }

        return svc
    };

    self.init = function (reg) {
        // extend in children. Add here bootstrapping code
        self.setRegistry(reg);
    };

    self.setRegistry = function (reg) {
        self.registry = reg;
    };

    self.disableControls = function () {
        // disable control components of current service
    };

    self.enableControls = function () {
        // enable control components of current service
    };

    self.disableOtherSvcControls = function (exceptName) {
        for (var i = 0; self.registry.services.length > i; i++) {
            if (self.registry.services[i].name != exceptName) {
                self.registry.services[i].disableControls();
            }
        }
    };

    self.enableOtherSvcControls = function (exceptName) {
        for (var i = 0; self.registry.services.length > i; i++) {
            if (self.registry.services[i].name != exceptName) {
                self.registry.services[i].enableControls();
            }
        }
    };
}();

// Services registry
var registry = function () {
    var self = this;
    self.services = [];

    self.add = function (svc) {
        self.services.push(svc);
    };

    self.runAll = function () {
        // run all services in registered order
        for (var index = 0; self.services.length > index; index++) {
            // self.services[index].call();
            if (typeof self.services[index] == 'function') {
                // init service
                self.services[index] = new self.services[index](self);
            }
        }
    };

    self.get = function (name) {
        for (var i = 0; self.services.length > i; i++) {
            if (self.services[i].name == name) {
                return self.services[i];
            }
        }

        return null;
    };
};

// === ContentSvc - service to handle main reader content
var contentSvc = function (reg) {
    var self = this;
    self.name = 'Content';
    self.readEl = null;
    self.editContentBtn = null;
    self.clearStylesBtn = null;
    self.editRawContentBtn = null;
    self.iframeEl = null;

    self.init = function (reg) {
        self.readEl = document.getElementById('read_content');

        if (!self.readEl) { // try searching iframe doc otherwise
            self.iframeEl = document.getElementById('read_window');
            self.readEl = self.iframeEl.contentDocument.getElementById('read_content');
            if (!self.readEl) {
                console.warn('Read content HTML element not found');
            }
        }

        self.editContentBtn = document.getElementById('edit_content_btn');
        self.editRawContentBtn = document.getElementById('edit_raw_content_btn');
        self.clearStylesBtn = document.getElementById('clear_styles_btn');

        self.readEl.contentEditable = false;

        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.disableControls = function () {
        if (self.editContentBtn) {
            self.editContentBtn.disabled = true;
        }

        if (self.editRawContentBtn) {
            self.editRawContentBtn.disabled = true;
        }

        if (self.clearStylesBtn) {
            self.clearStylesBtn.disabled = true;
        }
    };

    self.enableControls = function () {
        if (self.editContentBtn) {
            self.editContentBtn.disabled = false;
        }

        if (self.editRawContentBtn) {
            self.editRawContentBtn.disabled = false;
        }

        if (self.clearStylesBtn) {
            self.clearStylesBtn.disabled = false;
        }
    };

    self.bindFormEls = function () {
        self.editContentBtn.addEventListener('click', self.triggerEditContent);
        self.editRawContentBtn.addEventListener('click', self.triggerEditRawContent);
        self.clearStylesBtn.addEventListener('click', self.clearInlineStyles);

        if (self.iframeEl) {
            self.iframeEl.addEventListener('load', function () {
                self.resizeIframe();
            });

            self.readEl.addEventListener('change', function () {
                self.resizeIframe();
            });
        }
    };

    self.resizeIframe = function () {
        if (!self.iframeEl) {
            return;
        }

        self.iframeEl.style.height = self.iframeEl.contentWindow.document.body.scrollHeight + 'px';
    };

    self.triggerEditContent = function () {
        if (self.readEl.contentEditable == 'false') {
            self.readEl.contentEditable = true;
            self.readEl.style.border = '1px solid red';
            self.readEl.focus();
            self.editContentBtn.innerHTML = 'Stop Editing';

            self.editRawContentBtn.disabled = true;
            self.clearStylesBtn.disabled = true;
            self.disableOtherSvcControls(self.name);
        } else {
            self.readEl.contentEditable = false;
            self.readEl.style.border = 'none';
            self.editContentBtn.innerHTML = 'Edit Content';

            self.editRawContentBtn.disabled = false;
            self.clearStylesBtn.disabled = false;
            self.enableOtherSvcControls(self.name);
        }
    };

    self.triggerEditRawContent = function () {
        var buf;

        if (self.readEl.contentEditable == 'false') {
            self.readEl.contentEditable = true;
            self.readEl.style.border = '1px dashed red';
            self.readEl.focus();
            self.editRawContentBtn.innerHTML = 'Stop Editing';

            buf = self.readEl.innerHTML;
            self.readEl.innerText = buf;

            self.editContentBtn.disabled = true;
            self.clearStylesBtn.disabled = true;
            self.disableOtherSvcControls(self.name);
        } else {
            self.readEl.contentEditable = false;
            self.readEl.style.border = 'none';
            self.editRawContentBtn.innerHTML = 'Edit Raw Content';

            buf = self.readEl.innerText;
            self.readEl.innerHTML = buf;

            self.editContentBtn.disabled = false;
            self.clearStylesBtn.disabled = false;
            self.enableOtherSvcControls(self.name);
        }
    };

    self.clearInlineStyles = function () {
        var all = self.readEl.getElementsByTagName('*');
        var i = all.length;
        var j, is_hidden;

        // Presentational attributes.
        var attr = [
            'align',
            'background',
            'bgcolor',
            'border',
            'cellpadding',
            'cellspacing',
            'color',
            'face',
            'height',
            'hspace',
            'marginheight',
            'marginwidth',
            'noshade',
            'nowrap',
            'valign',
            'vspace',
            'width',
            'vlink',
            'alink',
            'text',
            'link',
            'frame',
            'frameborder',
            'clear',
            'scrolling',
            'style'
        ];

        var attr_len = attr.length;

        while (i--) {
            is_hidden = (all[i].style.display === 'none');

            j = attr_len;

            while (j--) {
                all[i].removeAttribute(attr[j]);
            }

            // Re-hide display:none elements,
            // so they can be toggled via JS.
            if (is_hidden) {
                all[i].style.display = 'none';
                is_hidden = false;
            }
        }
    };

    this.init(reg);
};

contentSvc.prototype = serviceObj;

// === Editor Svc - trigger editor panl
var editorPanelSvc = function (reg) {
    var self = this;
    self.name = 'Editor Trigger';
    self.hideBtn = null;
    self.showBtn = null;
    self.contentSvc = null;

    self.init = function (reg) {
        self.hideBtn = document.getElementById('hide_btn');
        self.showBtn = document.getElementById('show_btn');
        self.contentSvc = this.getContentSvc();

        self.bindFormEls();
        self.bindHotKeys();

        self.setRegistry(reg);
    };

    self.bindHotKeys = function () {
        var triggerForm = function (ev) {
            if (ev.code == 'Escape') {
                var neo = new Event('click');

                if (self.showBtn.style.display != 'none') {
                    self.showBtn.dispatchEvent(neo);
                } else {
                    self.hideBtn.dispatchEvent(neo);
                }
            }
        };

        // bindKeys
        document.body.onkeyup = triggerForm;
        if (self.contentSvc.iframeEl) {
            self.contentSvc.iframeEl.contentDocument.body.onkeyup = triggerForm;
        }
    };

    self.bindFormEls = function () {
        self.hideBtn.addEventListener('click', function () {
            document.forms[0].style.display = 'none';
            self.showBtn.style.display = 'inline-block';
        });

        self.showBtn.addEventListener('click', function () {
            document.forms[0].style.display = 'block';
            document.forms[0].focus();
            window.scrollTo(0, 0);
            this.style.display = 'none';
        });
    };

    this.init(reg);
};

editorPanelSvc.prototype = serviceObj;

// === FontSvc - change font settings
var fontSvc = function (reg) {
    var self = this;
    self.name = 'Font';
    self.fontFamilyEl = null;
    self.fontSizeEl = null;
    self.fontColorEl = null;
    self.readEl = null;
    self.fontColorPicker = null;
    self.contentSvc = null;

    self.init = function (reg) {
        self.fontFamilyEl = document.getElementById('f_font_family');
        self.fontSizeEl = document.getElementById('f_font_size');
        self.fontColorEl = document.getElementById('f_font_color');
        self.contentSvc = self.getContentSvc();
        self.readEl = self.contentSvc.readEl;
        self.fontColorPicker = document.getElementById('font_color_picker');

        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.bindFormEls = function () {
        self.fontFamilyEl.addEventListener('change', function () {
            self.readEl.style.fontFamily = '"' + this.value + '", "Courier New", "Times New Roman"';
            self.contentSvc.resizeIframe();
        });

        self.fontSizeEl.addEventListener('change', function (ev) {
            self.readEl.style.fontSize = ev.target.value + 'px';
            self.contentSvc.resizeIframe();
        });

        self.fontColorEl.addEventListener('change', function () {
            self.readEl.style.color = this.value;
            self.fontColorPicker.style.backgroundColor = this.value;
            self.contentSvc.resizeIframe();
        });
    };

    this.init(reg);
};

fontSvc.prototype = serviceObj;

// === BackgroundSvc - change background
var backgroundSvc = function (reg) {
    var self = this;
    self.name = 'Background';
    self.backgroundColorEl = null;
    self.readEl = null;
    self.backgroundColorPicker = null;
    self.contentSvc = null;

    self.init = function (reg) {
        self.backgroundColorEl = document.getElementById('f_back_color');
        self.contentSvc = self.getContentSvc();
        self.readEl = self.contentSvc.readEl;
        self.backgroundColorPicker = document.getElementById('back_color_picker');

        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.bindFormEls = function () {
        self.backgroundColorEl.addEventListener('change', function () {
            self.readEl.style.backgroundColor = this.value;
            if (self.contentSvc.iframeEl) {
                self.contentSvc.iframeEl.contentDocument.body.style.backgroundColor = this.value;
            }
            self.backgroundColorPicker.style.backgroundColor = this.value;
        });
    };

    this.init(reg);
};

backgroundSvc.prototype = serviceObj;

// === StorageSvc - save content to storage
var storageSvc = function (reg) {
    var self = this;
    self.name = 'Storage';
    self.saveBtn = null;
    self.readEl = null;
    self.cssStylesEl = null;
    self.contentSvc = null;
    self.fontSvc = null;
    self.backgroundSvc = null;

    self.init = function (reg) {
        self.contentSvc = self.getContentSvc();
        self.fontSvc = self.findService('Font');
        self.backgroundSvc = self.findService('Background');

        self.saveBtn = document.getElementById('save_btn');
        self.readEl = self.contentSvc.readEl;
        self.cssStylesEl = document.getElementById('custom_css');

        if (!self.cssStylesEl) { // try searching iframe doc otherwise
            self.cssStylesEl = self.contentSvc.iframeEl.contentDocument.getElementById('custom_css');
            if (!self.cssStylesEl) {
                console.warn('Custom CSS element not found');
            }
        }

        self.initStorage();
        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.disableControls = function () {
        if (self.saveBtn) {
            self.saveBtn.disabled = true;
        }
    };

    self.enableControls = function () {
        if (self.saveBtn) {
            self.saveBtn.disabled = false;
        }
    };

    self.initStorage = function () {
        var resize = false;
        // pass content from popup to window reader
        if (sessionStorage.getItem('read_content')) {
            self.readEl.innerHTML = sessionStorage.getItem('read_content');
            sessionStorage.removeItem('read_content'); // clear buffer
            resize = true;
        } else if (localStorage.getItem('read_content')) {
            self.readEl.innerHTML = localStorage.getItem('read_content'); // show last saved
            resize = true;
        }

        if (localStorage.getItem('css_content')) {
            self.cssStylesEl.innerHTML = localStorage.getItem('css_content');
            resize = true;
        }

        if (sessionStorage.getItem('presets')) {
            self.setPresets(JSON.parse(sessionStorage.getItem('presets')));
        } else if (localStorage.getItem('presets')) {
            self.setPresets(JSON.parse(localStorage.getItem('presets')));
        }

        if (resize) {
            self.contentSvc.resizeIframe();
        }
    };

    self.getPresets = function () {
        var data = {};
        if (self.fontSvc) {
            data.fontSize = self.fontSvc.fontSizeEl.value;
            data.fontColor = self.fontSvc.fontColorEl.value;
            data.fontFamily = self.fontSvc.fontFamilyEl.value;
        }

        if (self.backgroundSvc) {
            data.backgroundColor = self.backgroundSvc.backgroundColorEl.value;
        }

        return data;
    };

    self.setPresets = function (data) {
        var ev;
        if (self.fontSvc) {
            ev = new Event('change');

            self.fontSvc.fontSizeEl.value = data.fontSize;
            self.fontSvc.fontSizeEl.dispatchEvent(ev);

            self.fontSvc.fontColorEl.value = data.fontColor;
            self.fontSvc.fontColorEl.dispatchEvent(ev);

            self.fontSvc.fontFamilyEl.value = data.fontFamily;
            self.fontSvc.fontFamilyEl.dispatchEvent(ev);
        }

        if (self.backgroundSvc) {
            ev = new Event('change');
            self.backgroundSvc.backgroundColorEl.value = data.backgroundColor;
            self.backgroundSvc.backgroundColorEl.dispatchEvent(ev);
        }
    };

    self.bindFormEls = function () {
        self.saveBtn.addEventListener('click', function () {
            localStorage.setItem('read_content', self.readEl.innerHTML);
            localStorage.setItem('css_content', self.cssStylesEl.innerHTML);
            localStorage.setItem('presets', JSON.stringify(self.getPresets()));
        });
    };

    this.init(reg);
};

storageSvc.prototype = serviceObj;

// === ClipboardSvc - paste content to editor with formatting
var clipboardSvc = function (reg) {
    var self = this;
    self.name = 'Clipboard';
    self.pasteBtn = null;
    self.pasteCleanBtn = null;
    self.readEl = null;
    self.contentSvc = null;

    self.init = function (reg) {
        self.contentSvc = self.getContentSvc();
        self.readEl = self.contentSvc.readEl;
        self.pasteBtn = document.getElementById('paste_btn');
        self.pasteCleanBtn = document.getElementById('paste_clean_btn');

        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.disableControls = function () {
        if (self.pasteBtn) {
            self.pasteBtn.disabled = true;
        }

        if (self.pasteCleanBtn) {
            self.pasteCleanBtn.disabled = true;
        }
    };

    self.enableControls = function () {
        if (self.pasteBtn) {
            self.pasteBtn.disabled = false;
        }

        if (self.pasteCleanBtn) {
            self.pasteCleanBtn.disabled = false;
        }
    };

    self.triggerEditContent = function () {
        if (self.contentSvc.readEl.contentEditable == 'false') {
            self.contentSvc.readEl.contentEditable = true;
            self.contentSvc.editRawContentBtn.disabled = true;
        } else {
            self.contentSvc.readEl.contentEditable = false;
            self.contentSvc.editRawContentBtn.disabled = false;
        }
    };

    self.bindFormEls = function () {
        self.pasteBtn.addEventListener('click', function () {
            self.triggerEditContent();
            self.readEl.focus();
            self.readEl.innerHTML = '';
            if (self.contentSvc.iframeEl) {
                self.contentSvc.iframeEl.contentDocument.execCommand('paste');
            } else {
                document.execCommand('paste');
            }
            self.triggerEditContent();
            self.contentSvc.resizeIframe();
        });

        self.pasteCleanBtn.addEventListener('click', function () {
            self.triggerEditContent();
            self.readEl.focus();
            self.readEl.innerHTML = '';
            if (self.contentSvc.iframeEl) {
                self.contentSvc.iframeEl.contentDocument.execCommand('paste');
            } else {
                document.execCommand('paste');
            }
            self.readEl.innerHTML = self.readEl.innerText;
            self.triggerEditContent();
            self.contentSvc.resizeIframe();
        });
    };

    this.init(reg);
};

clipboardSvc.prototype = serviceObj;

// === StylesSvc - custom CSS styles
var stylesSvc = function (reg) {
    var self = this;
    self.name = 'Styles';
    self.readEl = null;

    self.cssBtn = null;
    self.cssStylesEl = null;
    self.cssStylesEditorEl = null;


    self.init = function (reg) {
        self.readEl = self.getContentSvc().readEl;
        self.cssBtn = document.getElementById('css_btn');
        self.cssStylesEditorEl = document.getElementById('custom_css_editor');
        self.cssStylesEl = document.getElementById('custom_css');
        if (!self.cssStylesEl) { // try searching iframe doc otherwise
            var contentSvc = this.getContentSvc();
            self.cssStylesEl = contentSvc.iframeEl.contentDocument.getElementById('custom_css');
            if (!self.cssStylesEl) {
                console.warn('Custom CSS element not found');
            }
        }

        self.cssStylesEditorEl.contentEditable = true;

        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.disableControls = function () {
        if (self.cssBtn) {
            self.cssBtn.disabled = true;
        }
    };

    self.enableControls = function () {
        if (self.cssBtn) {
            self.cssBtn.disabled = false;
        }
    };

    self.bindFormEls = function () {
        self.cssBtn.addEventListener('click', function () {
            if (self.cssStylesEditorEl.style.display != 'block') {
                self.cssStylesEditorEl.innerText = self.cssStylesEl.innerHTML;
                self.cssStylesEditorEl.style.display = 'block';
                self.cssStylesEditorEl.focus();
                this.innerHTML = 'Stop Editing';
                self.readEl.style.display = 'none';
                self.disableOtherSvcControls(self.name);

                console.log(self.cssStylesEl.innerHTML);
            } else {
                self.cssStylesEl.innerHTML = self.cssStylesEditorEl.innerText;
                self.cssStylesEditorEl.style.display = 'none';
                this.innerHTML = 'Edit CSS';
                self.readEl.style.display = 'block';
                self.enableOtherSvcControls(self.name);

                console.log(self.cssStylesEditorEl.innerText);
            }
        });
    };

    this.init(reg);
};

stylesSvc.prototype = serviceObj;

// === WindowSvc - window popup manipulation
var windowSvc = function (reg) {
    var self = this;
    self.name = 'Window';
    self.readEl = null;

    self.widthEl = null;
    self.heightEl = null;
    self.form = null;

    self.init = function (reg) {
        self.readEl = self.getContentSvc().readEl;
        self.widthEl = document.getElementById('f_input_width');
        self.heightEl = document.getElementById('f_input_height');
        self.form = document.forms[0];

        self.bindFormEls();
        self.setRegistry(reg);
    };

    self.bindFormEls = function () {
        self.widthEl.addEventListener('input', function () {
            document.getElementById('f_output_width').innerHTML = this.value + ' px';
        });

        self.widthEl.addEventListener('change', function () {
            document.getElementsByClassName('content')[0].style.width = this.value - 30 + 'px';
        });

        self.heightEl.addEventListener('input', function () {
            document.getElementById('f_output_height').innerHTML = this.value + ' px';
        });

        self.heightEl.addEventListener('change', function () {
            document.getElementsByClassName('content')[0].style.height = this.value - 30 + 'px';
        });

        self.form.addEventListener('submit', function () {
            sessionStorage.setItem('read_content', self.readEl.innerHTML);
            window.open('window.html#' + self.widthEl.value + "," + self.heightEl.value, 'Nerd Book', "location=no,width=" + self.widthEl.value + ",height=" + self.heightEl.value + ",scrollbars=yes");

            return false;
        });
    };

    this.init(reg);
};

windowSvc.prototype = serviceObj;