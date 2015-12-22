$(document).ready(function() {
    var toggleAuto = $("#toggleAuto");
    var toggle = false;


    document.addEventListener('DOMContentLoaded', function () {
      toggleAuto.click(function() {
        console.log('testing')
      })
          // document.querySelector('#toggleAuto').addEventListener('change', changeHandler);
    });

    function changeHandler() {
      toggle = !toggle;
      console.log(toggle)
    }

    function init(){
        attachEvents();
        // getOptions();
    }

    function attachEvents(){
        console.log('runniasdfng')
        toggleAuto.on("click", setOptions);
        toggleAuto.click(function() {
            console.log('this is working')
        })
        chrome.runtime.onMessage.addListener(gotMessage);
    }

    function gotMessage(request, sender, sendResponse) {
        if (sender.tab && request.closePopup){
            window.close();
        }
    }

    // function getOptions(){
    //     chrome.storage.sync.get("qrEnable",gotOptions);
    // }

    // function gotOptions(data){
    //     //console.log(data);
    //     if(data.qrEnable == undefined){
    //         chrome.storage.sync.set({"qrEnable":true});
    //         data.qrEnable = true;
    //     }
    //     qrOption.prop("checked", data.qrEnable);
    // }

    function setOptions(){
        console.log("setting changes");
        // chrome.storage.sync.set({"qrEnable":qrOption.prop("checked")});
    }

    init();
});