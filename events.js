export function saveEvent(event) {
    chrome.storage.local.get(['events'], function(result) {
        let events = result.events || [];
        events.push(event);
        chrome.storage.local.set({ events: events });
    });
}

export function updateEventAtIndex(indexToUpdate, newValue) {
    chrome.storage.local.get(['events'], function(result) {
        let events = result.events || [];

        if (indexToUpdate >= 0 && indexToUpdate < events.length) {
            events[indexToUpdate] = newValue; 
            chrome.storage.local.set({ events: events }, function() {
                console.log('Event at index ' + indexToUpdate + ' has been updated.');
            });
        } else {
            console.log('Invalid index: ' + indexToUpdate);
        }
    });
}

export function getEvents(callback){
    chrome.storage.local.get(['events'],callback)
}

export function emptyEvents(){
    getEvents(function(result){
        chrome.storage.local.set({events:[]});
    });
}