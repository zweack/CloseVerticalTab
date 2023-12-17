chrome.manifest = chrome.app.getDetails();

var _currentVersion = chrome.app.getDetails().version;
var _opPinnedTabs = 'closed';

chrome.browserAction.onClicked.addListener(MainIconClicked);

OnExtensionLoad();
function OnExtensionLoad() {
	LoadSettings();
	PopInstructions();
}

function MainIconClicked() {
	chrome.tabs.getSelected(null, CloseThisTab);
}

function CloseThisTab(tab) {
	_opPinnedTabs = localStorage.getItem('opPinnedTabs') || 'closed';

	if (_opPinnedTabs == 'protected' && tab.pinned)
		return;

	chrome.tabs.remove(tab.id);

	//  This code can change which tab is selected
	//	chrome.tabs.update(tabId, {selected: true});
}

function LoadSettings() {
	_opPinnedTabs = localStorage.getItem('opPinnedTabs') || 'closed';

	chrome.storage.sync.get('opPinnedTabs', function (data) {

		// If the data read correctly get it, otherwise do nothing.
		_opPinnedTabs = (data.opPinnedTabs) ? data.opPinnedTabs : _opPinnedTabs;

		localStorage.setItem('opPinnedTabs', _opPinnedTabs);
	});
}

function PopInstructions() {
	// If user has never ran the app before, pop the instructions
	// only do so if saving the new version is possible
	var lastVersionRan = 0;

	chrome.storage.sync.get('last_version_ran', function (data) {

		if (data.last_version_ran) {
			lastVersionRan = data.last_version_ran;
		}

		if (lastVersionRan == 0) {
			chrome.tabs.create({ url: "options.html" });
		}

		SetCurrentVersion(_currentVersion);
	});
}

function SetCurrentVersion(currentVersion) {
	chrome.storage.sync.set({ 'last_version_ran': currentVersion }, function () {
		console.log("Last version was saved. (" + currentVersion + ")");
	});
}