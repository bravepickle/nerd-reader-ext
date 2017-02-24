window.addEventListener('load', function () {
    var registrySvc = new registry();

    registrySvc.add(contentSvc);
    registrySvc.add(storageSvc);
    registrySvc.add(stylesSvc);
    registrySvc.add(clipboardSvc);
    registrySvc.add(windowSvc);

    registrySvc.runAll();
});