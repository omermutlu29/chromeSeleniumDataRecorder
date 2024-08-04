chrome.webNavigation.onCommitted.addListener(function(details) {
    console.log(details, "commited");
    if (details.frameId === 0) {
        chrome.storage.local.get(['events'], function(result) {
            let events = result.events || [];
            events.push({
                url: details.url,
                timestamp: new Date().toISOString(),
                type: 'navigation'
            });
            chrome.storage.local.set({ events: events });

        })
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log(details,"onHistoryStateUpdated");
    if (details.frameId === 0) {
        chrome.storage.local.get(['events'], function(result) {
            let events = result.events || [];
            events.push({
                url: details.url,
                timestamp: new Date().toISOString(),
                type: 'navigation'
            });
            chrome.storage.local.set({ events: events });
        })
    }
});
