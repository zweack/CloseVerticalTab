/*global document, window, ctStorage, chrome */
(function () {

    "use strict";

    chrome.manifest = chrome.app.getDetails();
    var appName = chrome.manifest.name + " for Chrome";

    function save_options() {

        var select = document.getElementById("opPinnedTabs"),
            opPinnedTabs = select.children[select.selectedIndex].value;

        localStorage.setItem('opPinnedTabs', opPinnedTabs);
        console.log('Local Storage: Set opPinnedTabs to ' + opPinnedTabs);

        chrome.storage.sync.set({ 'opPinnedTabs': opPinnedTabs }, function () {
            console.log('Sync Storage: Set opPinnedTabs to ' + opPinnedTabs);
        });
    }

    function selectComboBox(element, key) {
        var i,
            child;

        for (i = 0; i < element.children.length; i++) {
            child = element.children[i];
            if (child.value === key) {
                child.selected = "true";
                break;
            }
        }
    }

    // Restores select box state to saved value from storage.
    function restore_options() {

        console.log('restore_options()...');

        var _opPinnedTabs = localStorage.getItem('opPinnedTabs') || 'closed';

        chrome.storage.sync.get('opPinnedTabs', function (data) {

            var opPinnedTabs = (data.opPinnedTabs) ? data.opPinnedTabs : "closed";

            console.log('Storage: opPinnedTabs was ' + opPinnedTabs);

            selectComboBox(document.getElementById("opPinnedTabs"), opPinnedTabs);

        });

        localStorage.setItem('opPinnedTabs', _opPinnedTabs);
        selectComboBox(document.getElementById("opPinnedTabs"), _opPinnedTabs);
    }


    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }


    // Execute when finished loading
    var readyStateCheckInterval = window.setInterval(function () {
        if (document.readyState === "complete") {
            window.clearInterval(readyStateCheckInterval);
            console.log('Options page readystate is complete.');

            var opPinnedTabs = document.getElementById("opPinnedTabs");

            opPinnedTabs.onchange = function (e) {
                save_options();
            };

            restore_options();
        }
    }, 10);
}());