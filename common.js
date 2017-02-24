// === Base class for services
var serviceObj = new function () {
    var self = this;
    self.name = 'NONAME'; // service name
    self.registry = null;
    self.contentSvc = null;

    self.getContentSvc = function () {
        if (!self.contentSvc) {
            self.contentSvc = self.registry.get('Content');
            if (!self.contentSvc || typeof self.contentSvc != 'object') {
                console.warn('Content service is not initialized');
                return null;
            }
        }

        return self.contentSvc;
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
            // } else {
            //     self.services[index].init(self);
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
    self.editRawContentBtn = null;

    self.init = function (reg) {
        self.readEl = document.getElementById('read_content');
        self.editContentBtn = document.getElementById('edit_content_btn');
        self.editRawContentBtn = document.getElementById('edit_raw_content_btn');

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
    };

    self.enableControls = function () {
        if (self.editContentBtn) {
            self.editContentBtn.disabled = false;
        }

        if (self.editRawContentBtn) {
            self.editRawContentBtn.disabled = false;
        }
    };

    self.bindFormEls = function () {
        self.editContentBtn.addEventListener('click', self.triggerEditContent);
        self.editRawContentBtn.addEventListener('click', self.triggerEditRawContent);
    };

    self.triggerEditContent = function () {
        if (self.readEl.contentEditable == 'false') {
            self.readEl.contentEditable = true;
            self.readEl.style.border = '1px solid red';
            self.readEl.focus();
            self.editContentBtn.innerHTML = 'Stop Editing';

            self.editRawContentBtn.disabled = true;
            self.disableOtherSvcControls(self.name);
        } else {
            self.readEl.contentEditable = false;
            self.readEl.style.border = 'none';
            self.editContentBtn.innerHTML = 'Edit Content';

            self.editRawContentBtn.disabled = false;
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
            self.disableOtherSvcControls(self.name);
        } else {
            self.readEl.contentEditable = false;
            self.readEl.style.border = 'none';
            self.editRawContentBtn.innerHTML = 'Edit Raw Content';

            buf = self.readEl.innerText;
            self.readEl.innerHTML = buf;

            self.editContentBtn.disabled = false;
            self.enableOtherSvcControls(self.name);
        }
    }

    this.init(reg);
};

contentSvc.prototype = serviceObj;

// === Editor Svc - trigger editor panl
var editorPanelSvc = function (reg) {
    var self = this;
    self.name = 'Editor Trigger';
    self.hideBtn = null;
    self.showBtn = null;

    self.init = function (reg) {
        self.hideBtn = document.getElementById('hide_btn');
        self.showBtn = document.getElementById('show_btn');

        self.bindFormEls();
        self.bindHotKeys();

        self.setRegistry(reg);
    };

    self.bindHotKeys = function () {
        // bindKeys
        document.body.onkeyup = function (ev) {
            if (ev.code == 'Escape') {
                var neo = new Event('click');

                if (self.showBtn.style.display != 'none') {
                    self.showBtn.dispatchEvent(neo);
                } else {
                    self.hideBtn.dispatchEvent(neo);
                }
            }
        };
    };

    self.bindFormEls = function () {
        self.hideBtn.addEventListener('click', function () {
            document.forms[0].style.display = 'none';
            self.showBtn.style.display = 'inline-block';
        });

        self.showBtn.addEventListener('click', function () {
            document.forms[0].style.display = 'block';
            this.style.display = 'none';
        });
    };

    this.init(reg);
};

editorPanelSvc.prototype = serviceObj;

// === FontSvc - change font settings
var fontSvc = function (reg) {
    var self = this;
    self.name = 'Font Size Editor';
    self.fontFamilyEl = null;
    self.fontSizeEl = null;
    self.fontColorEl = null;
    self.readEl = null;
    self.fontColorPicker = null;

    self.init = function (reg) {
        self.fontFamilyEl = document.getElementById('f_font_family');
        self.fontSizeEl = document.getElementById('f_font_size');
        self.fontColorEl = document.getElementById('f_font_color');
        self.readEl = self.getContentSvc().readEl;
        self.fontColorPicker = document.getElementById('font_color_picker');

        self.bindFormEls();

        self.setRegistry(reg);
    };

    self.bindFormEls = function () {
        self.fontFamilyEl.addEventListener('change', function () {
            self.readEl.style.fontFamily = '"' + this.value + '", "Courier New", "Times New Roman"';
            self.readEl.setAttribute('style', 'font-family: "' + this.value + '", "Courier New", "Times New Roman" !important');
        });

        self.fontSizeEl.addEventListener('change', function (ev) {
            self.readEl.style.fontSize = ev.target.value + 'px';
            self.readEl.style.cssText = 'font-size: ' + this.value + 'px !important';
        });

        self.fontColorEl.addEventListener('change', function () {
            self.readEl.style.color = this.value;
            self.fontColorPicker.style.backgroundColor = this.value;
        });
    };

    this.init(reg);
};

fontSvc.prototype = serviceObj;

// === BackgroundSvc - change background
var backgroundSvc = function (reg) {
    var self = this;
    self.name = 'Background Editor';
    self.backgroundColorEl = null;
    self.readEl = null;
    self.backgroundColorPicker = null;

    self.init = function (reg) {
        self.backgroundColorEl = document.getElementById('f_back_color');
        self.readEl = self.getContentSvc().readEl;
        self.backgroundColorPicker = document.getElementById('back_color_picker');

        self.bindFormEls();

        self.setRegistry(reg);
    };

    self.bindFormEls = function () {
        self.backgroundColorEl.addEventListener('change', function () {
            self.readEl.style.backgroundColor = this.value;
            self.backgroundColorPicker.style.backgroundColor = this.value;
        });
    };

    this.init(reg);
};

backgroundSvc.prototype = serviceObj;

// === StorageSvc - save content to storage
var storageSvc = function (reg) {
    var self = this;
    self.name = 'Content Storage';
    self.saveBtn = null;
    self.readEl = null;
    self.cssStylesEl = null;

    self.init = function (reg) {
        self.saveBtn = document.getElementById('save_btn');
        self.readEl = self.getContentSvc().readEl;
        self.cssStylesEl = document.getElementById('custom_css');

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
        // pass content from popup to window reader
        if (sessionStorage.getItem('read_content')) {
            self.readEl.innerHTML = sessionStorage.getItem('read_content');
            sessionStorage.removeItem('read_content'); // clear buffer
        } else if (localStorage.getItem('read_content')) {
            self.readEl.innerHTML = localStorage.getItem('read_content'); // show last saved
        }

        if (localStorage.getItem('css_content')) {
            self.cssStylesEl.innerHTML = localStorage.getItem('css_content');
        }
    };

    self.bindFormEls = function () {
        self.saveBtn.addEventListener('click', function () {
            localStorage.setItem('read_content', self.readEl.innerHTML);
            localStorage.setItem('css_content', self.cssStylesEl.innerHTML);
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
        self.readEl = self.getContentSvc().readEl;
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
        var contentSvc = self.getContentSvc();

        if (contentSvc.readEl.contentEditable == 'false') {
            contentSvc.readEl.contentEditable = true;
            contentSvc.editRawContentBtn.disabled = true;
        } else {
            contentSvc.readEl.contentEditable = false;
            contentSvc.editRawContentBtn.disabled = false;
        }
    };

    self.bindFormEls = function () {
        self.pasteBtn.addEventListener('click', function () {


            self.triggerEditContent();
            self.readEl.focus();
            self.readEl.innerHTML = '';
            document.execCommand('paste');
            self.triggerEditContent();
        });

        self.pasteCleanBtn.addEventListener('click', function () {
            self.triggerEditContent();
            self.readEl.focus();
            self.readEl.innerHTML = '';
            document.execCommand('paste');
            self.readEl.innerHTML = self.readEl.innerText;
            self.triggerEditContent();
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
        self.cssStylesEl = document.getElementById('custom_css');
        self.cssStylesEditorEl = document.getElementById('custom_css_editor');

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
                this.innerHTML = 'Close CSS editor';
                self.readEl.style.display = 'none';

                // avoid misuse of editor
                // pasteCleanBtn.disabled = true;
                // pasteBtn.disabled = true;
                // saveBtn.disabled = true;
                // editContentBtn.disabled = true;
                // editRawContentBtn.disabled = true;

                // for (var i = 0; self.registry.services.length > i; i++) {
                //     if (self.registry.services[i].getName() != self.getName()) {
                //         self.registry.services[i].disableControls();
                //     }
                // }

                self.disableOtherSvcControls(self.name);
            } else {
                self.cssStylesEl.innerHTML = self.cssStylesEditorEl.innerText;
                self.cssStylesEditorEl.style.display = 'none';
                this.innerHTML = 'Edit CSS';
                self.readEl.style.display = 'block';
                // avoid misuse of editor
                // self.pasteCleanBtn.disabled = false;
                // self.pasteBtn.disabled = false;
                // self.saveBtn.disabled = false;
                // self.editContentBtn.disabled = false;
                // self.editRawContentBtn.disabled = false;

                // for (var i = 0; self.registry.services.length > i; i++) {
                //     if (self.registry.services[i].getName() != self.getName()) {
                //         self.registry.services[i].enableControls();
                //     }
                // }

                self.enableOtherSvcControls(self.name);
            }
        });
    };

    this.init(reg);
};

stylesSvc.prototype = serviceObj;