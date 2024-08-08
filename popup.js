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
        console.log('celared content');
        chrome.storage.local.set({ events: [] });
        chrome.storage.local.get(['events'], refreshText);
      
    })

    document.getElementById('startRecord').addEventListener('click',function(){
        console.log('Record Started');
        chrome.storage.local.set({ startRecord:true });
        document.getElementById('startRecord').disabled = true;
        document.getElementById('stopRecord').disabled = false;

    })

    document.getElementById('stopRecord').addEventListener('click',function(){
        console.log('Record Stopped');
        chrome.storage.local.set({ startRecord:false });
        document.getElementById('startRecord').disabled = false;
        document.getElementById('stopRecord').disabled = true;
    })
});
