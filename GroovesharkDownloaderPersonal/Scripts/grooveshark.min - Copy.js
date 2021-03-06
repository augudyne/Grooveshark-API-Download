var s = document.createElement("script");
s.src = chrome.extension.getURL("Scripts/page.min.js");
s.onload = function() {
    this.parentNode.removeChild(this);
	
};
var songIDarray = [];
var counter = 0;
var mycounter = 0;
var generatedtag = "";
var downloadToggle = false;
(document.head || document.documentElement).appendChild(s);
var port = chrome.extension.connect({
    name: "msg"
});
document.addEventListener("DOMNodeInserted", function(a) {
    a.stopPropagation()
}, true);
window.addEventListener("hashchange",function(){
        confirm("Page Changed");
		onpageload();
	});
document.addEventListener("click", function(a) {
    if (a.target.getAttribute("data-d") == "1") {
        a.stopPropagation();
        songDownloadClicked(a.target);
        return false
    }
}, true);

function songDownloadClicked(b) {
    var a = $(b).attr("rel");
    $(b).text("0 %");
	if(confirm(a)){	
    port.postMessage({
        method: "download",
        songId: a
    })
	}
}

function onpageload(){
	confirm();
    var title = $('div.title');
	title.text("Download Playlist!");
	songIDarray = songIDarray.reverse();
	title.click(function(){
	downloadToggle = !downloadToggle;
	if(downloadToggle == true){
		if(confirm("Do you want to begin downloading every song on this page?")){
			title.text("Downloading...");
			title.css("color", "#00FF00");
			t();t();t();
		}
	}
	if(downloadToggle == false){
		title.text("Download Paused...");
		title.css("color", "#ffffff");
		console.log("Download Stopped");
	}
	});
	
}
function t(){
	console.log(songIDarray.length);
	console.log(songIDarray);
			port.postMessage({
			method: "download",
			songId: songIDarray.pop()	
			})
	var g = $("#" + generatedtag + songIDarray[mycounter]);
	/* while(g != "You've got it!"){
		console.log("Not Yet...");
	}
	if(mycounter < (songIDarray.length - 1)){
		t(mycounter+1);
	} 
	*/
}

$(function() {
    var b = d();
    var c = d();
	generatedtag = b;
    port.onMessage.addListener(function(g) {
        if (g.method == "updateProgress") {
            f(g.songId, g.progress)
        } else {
            if (g.method == "downloadComplete") {
                a(g.songId, g.url, g.fileName)
            }
        }
    });
    setTimeout(function() {
        var g = document.getElementsByClassName("grid-viewport");
        if (g) {
            e();
        }
    }, 5000);
	
	setTimeout(onpageload(), 5000);
	
    function d() {
        var j = "";
        var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var g = 0; g < 6; g++) {
            j += h.charAt(Math.floor(Math.random() * h.length))
        }
		return j
    }

    function e() {
        $("i.song-link").each(function(h) {			
            var g = $(this).parent().find("span." + b);
            var j = $(this).attr("rel");
			songIDarray[counter] = j;
			counter++;
            if (g.length == 0) {
                var g = $("<span>").text("D0wnload " + songIDarray.length).addClass(b).attr("id", b + j).attr("rel", j).attr("style", ";color:#2a9914 !important;cursor:pointer;").attr("data-d", "1");               
				g.appendTo($(this).parent())
            } else {
                if (g.attr("rel") != j) {
                    g.text("D0wnload").attr("id", b + j).attr("rel", j).attr("style", "color:#2a9914 !important;cursor:pointer;").attr("data-d", "1")
                }
            }
        })
    }

    function f(i, h) {
        var g = $("#" + b + i);
        g.text(h + " %")
		if(h == 100){
			if(downloadToggle == true){
			t();
			}
		}
    }

    function a(k, l, i) {
        var h = $("#" + b + k);
        h.attr("data-d", "0");
        h.text(chrome.i18n.getMessage("downloadFinished"));
        h.attr("style", "color:#2b2b2b !important;");
        h.attr("href", l);
        h.attr("download", i);
        var j = document.createElement("a");
        j.setAttribute("href", l);
        j.setAttribute("download", i);
        document.body.appendChild(j);
        var g = document.createEvent("MouseEvent");
        g.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        j.dispatchEvent(g);
        setTimeout(function() {
            document.removeChild(j)
        }, 10)
    }
});