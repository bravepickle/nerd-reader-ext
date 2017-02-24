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
});