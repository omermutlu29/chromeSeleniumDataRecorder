chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.storage.local.get(['startRecord'],function(res){
        if(res.startRecord){
            if (details.frameId === 0) {
                chrome.storage.local.get(['events'], function(result) {
                
                    let events = result.events || [];
                    events.push({
                        url: details.url,
                        timestamp: new Date().toISOString(),
                        reason:details.transitionType,
                        type: 'navigation'
                    });
                    chrome.storage.local.set({ events: events });
                })
            }
        }
    })
});
