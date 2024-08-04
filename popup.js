function refreshText(result) {
    const events = result.events || [];
    document.getElementById('events').textContent = JSON.stringify(events, null, 2);
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['events'], refreshText);
    
    document.getElementById('download').addEventListener('click', function() {
        chrome.storage.local.get(['events'], function(result) {
            const events = result.events || [];
            const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'events.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    });

    document.getElementById('clear').addEventListener('click',function(){
        console.log('clicked');
        chrome.storage.local.set({ events: [] });
        chrome.storage.local.get(['events'], refreshText);
    })

    document.getElementById('show').addEventListener('click',function(){
        console.log('clear');
        chrome.storage.local.set({ events: [] });
        chrome.storage.local.get(['events'], refreshText);
    })
});
