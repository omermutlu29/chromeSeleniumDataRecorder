let lastInputEvents = {};

document.addEventListener('click', function(event) {
    chrome.storage.local.get(['events'], function(result) {
        let events = result.events || [];
        events.push({
            type: 'click',
            target: event.target.tagName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            xpath: getXPath(event.target)
        });
        chrome.storage.local.set({ events: events });
    });
});

document.addEventListener('input', function(event) {
    chrome.storage.local.get(['events'], function(result) {
        let events = result.events || [];
        let xpath = getXPath(event.target);
        if(events.length > 0 && events[events.length-1].xpath == xpath){
            events[events.length-1] = {
                type: 'input',
                target: event.target.tagName,
                value: event.target.value,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                xpath: xpath
            }
        }else{
            events.push({
                type: 'input',
                target: event.target.tagName,
                value: event.target.value,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                xpath: xpath
            });
        }
        chrome.storage.local.set({ events: events });
    });
});

// XPath hesaplama fonksiyonu
function getXPath(element) {
    if (element.id) {
        return '//*[@id="' + element.id + '"]';
    }
    return getElementXPath(element);
}

function getElementXPath(element) {
    let path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
        let index = 0;
        for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
                index++;
            }
        }
        path.unshift(element.tagName + '[' + (index + 1) + ']');
        element = element.parentNode;
    }
    return path.length ? '/' + path.join('/') : null;
}
