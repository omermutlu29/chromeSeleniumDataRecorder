function refreshText(result) {
    const events = result.events || [];
    document.getElementById('events').textContent = JSON.stringify(events, null, 2);
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['events'], refreshText);
    chrome.storage.local.get(['startRecord'], function(res){
        console.log("recordStatus",res.startRecord)
        document.getElementById('startRecord').disabled = res.startRecord;
        document.getElementById('stopRecord').disabled = !res.startRecord;
    });


    document.getElementById('startRecord').addEventListener('click',function(){
        console.log('Record Started');
        chrome.storage.local.set({ startRecord:true });
        document.getElementById('startRecord').disabled = true;
        document.getElementById('stopRecord').disabled = false;
        //set empty events
        chrome.storage.local.set({ events: [] });

        //set current url as entrypoint
        console.log("startRecord clicked");
        chrome.storage.local.get(['events'], function(result) {
            console.log("startRecord events",result);

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                console.log("active tabs",tabs)
                

                var currentTab = tabs[0];
                var currentUrl = currentTab.url;
                let events = result.events || [];
                events.push({
                    url: currentUrl,
                    timestamp: new Date().toISOString(),
                    reason:"start",
                    type: 'navigation'
                });
                chrome.storage.local.set({ events: events });
            });
            
        });




    })

    document.getElementById('stopRecord').addEventListener('click',function(){
        console.log('Record Stopped');
        chrome.storage.local.set({ startRecord:false });

        document.getElementById('startRecord').disabled = false;
        document.getElementById('stopRecord').disabled = true;



        chrome.storage.local.get(['events'], function(result) {
            const events = result.events || [];
            console.log(events)
            const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'events.json';
            a.click();
            URL.revokeObjectURL(url);
        });
        chrome.storage.local.set({ events: [] });

    })
});
