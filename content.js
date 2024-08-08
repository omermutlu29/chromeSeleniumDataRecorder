document.addEventListener('mouseover', function(event) {
    chrome.storage.local.get(['startRecord'],function(res){
        if(res.startRecord){
            let element = event.target;
            if (element && document.readyState == 'complete') {
                chrome.storage.local.get(['events'], function(result) {
                    let events = result.events || [];
                    events.push({
                        type: 'mouseover',
                        target: event.target.tagName,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        xpath: getXPath(event.target),
                        scrollTop: window.scrollY || document.documentElement.scrollTop,
                        scrollLeft: window.scrollX || document.documentElement.scrollLeft
                    });
                    chrome.storage.local.set({ events: events });
                });
            }
        }
    })
});
document.addEventListener('mousedown', function(event) {
    chrome.storage.local.get(['startRecord'],function(res){
        if(res.startRecord){
            chrome.storage.local.get(['events'], function(result) {
                console.log(getXPath(event.target))
                let events = result.events || [];
                events.push({
                    type: 'click',
                    target: event.target.tagName,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    xpath: getXPath(event.target),
                    scrollTop: window.scrollY || document.documentElement.scrollTop,
                    scrollLeft: window.scrollX || document.documentElement.scrollLeft
                });
                chrome.storage.local.set({ events: events });
            });
        }
    })
});

document.addEventListener('dblclick', function(event) {
    chrome.storage.local.get(['startRecord'],function(res){
        if(res.startRecord){
            chrome.storage.local.get(['events'], function(result) {
                let events = result.events || [];
                console.log(getXPath(event.target))
                events.push({
                    type: 'dblclick',
                    target: event.target.tagName,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    xpath: getXPath(event.target),
                    scrollTop: window.scrollY || document.documentElement.scrollTop,
                    scrollLeft: window.scrollX || document.documentElement.scrollLeft
                });
                chrome.storage.local.set({ events: events });
            });
        }
    })
});

document.addEventListener('input', function(event) {
    chrome.storage.local.get(['startRecord'],function(res){
        if(res.startRecord){
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
                        xpath: xpath,
                        scrollTop: window.scrollY || document.documentElement.scrollTop,
                        scrollLeft: window.scrollX || document.documentElement.scrollLeft
                    }
                }else{
                    events.push({
                        type: 'input',
                        target: event.target.tagName,
                        value: event.target.value,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        xpath: xpath,
                        scrollTop: window.scrollY || document.documentElement.scrollTop,
                        scrollLeft: window.scrollX || document.documentElement.scrollLeft
                    });
                }
                chrome.storage.local.set({ events: events });
            });
        }
    })

    
});




const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
               
            });
        }
    }
});


observer.observe(document.body, { childList: true, subtree: true });

function getXPath(element) {
    if (element.id !== '') {
        return 'id("' + element.id + '")';
    }
    if (element === document.body) {
        return element.tagName.toLowerCase();
    }

    var ix = 0;
    var siblings = element.parentNode.childNodes;

    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];

        if (sibling === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }

        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}