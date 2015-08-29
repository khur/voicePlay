/**
 *  Module
 *
 * Description
 */
angular.module('voicePlay', [])
    .controller('voiceController', voiceController);

function voiceController() {


    var ctrl = this;

    ctrl.getSuccess;
    ctrl.showIt;

    ctrl.show = show;
    ctrl.hide = hide;
    ctrl.hideBoth = hideBoth;

    function show() {
        return ctrl.getSuccess = true, ctrl.vis = true;
    }

    function hide() {
        return ctrl.getSuccess = false, ctrl.vis = false;

    }

    function hideBoth() {
        return ctrl.showIt = '', ctrl.showControls = ''; 
    }







    // Microphone from Wit.ai api

    var mic = new Wit.Microphone(document.getElementById("microphone"));

    var info = function(msg) {
        document.getElementById("info").innerHTML = msg;

    };

    var error = function(msg) {
        document.getElementById("error").innerHTML = msg;
    };
    mic.onready = function() {
        info("Microphone is ready to record");
    };
    mic.onaudiostart = function() {
        info("Recording started");
        error("");
    };
    mic.onaudioend = function() {
        info("Recording stopped, processing started");
    };
    mic.onresult = function(intent, entities) {
        var r = kv("intent", intent);
        // console.log(r);
        // console.log("First entities \n");
        // console.dir(entities);

        for (var k in entities) {
            var e = entities[k];
            if (!(e instanceof Array)) {
                r += kv(k, e.value);
            } else {
                for (var i = 0; i < e.length; i++) {
                    r += kv(k, e[i].value);
                }
            }
        }
        // console.log("this is second entities: \n");
        // console.dir(entities);
        if (!entities.artist && !entities.track) {
            alert("Sorry I missed that... Try again?");
        } else {

            var song = "";
            if (entities.artist && entities.track) {
                song = entities.track.body;
            }

            if (!entities.artist && entities.track) {
                song = entities.track.body;
            }

            if (entities.artist && !entities.track) {
                song = entities.artist.body;
            }
            // console.log(song);

            // Embeds SoundCloud widget on result of search
            var random = Math.round((Math.random(0, 10) * 10))
            var keyWord = sanitizeUrl(song);
            // console.log("keyWord = " + keyWord);

            SC.initialize({
                client_id: 'H5QMXAT27JD7BXIFPF5EIFU23VT2XFTV'
            });



            SC.get('/tracks', {
                q: keyWord
            }, function(tracks) {
                // console.log("tracks: \n" + tracks);
                // console.dir(tracks);
                var track_url = tracks[random].uri;
                // console.log("track url: " + track_url);
                SC.oEmbed(track_url, {
                    auto_play: true,
                    maxheight: 166
                }, function(oEmbed) {

                    if (oEmbed === null) {
                        alert("Hey sorry about that. Let's try it again.. yeah? ")
                    }

                    // console.log('oEmbed response: ' + oEmbed);
                    // console.dir(oEmbed);

                    document.getElementById("soundCloud").innerHTML = oEmbed.html;
                    
                    console.log("Great Pick!")
                });
            });

        }


        document.getElementById("result").innerHTML = r;

    };


    mic.onerror = function(err) {
        error("Error: " + err);
    };

    mic.onconnecting = function() {
        info("Microphone is connecting");
    };

    mic.ondisconnected = function() {
        info("Microphone is not connected");
    };

    mic.connect("H5QMXAT27JD7BXIFPF5EIFU23VT2XFTV");
    // mic.start();
    // mic.stop();

    function kv(k, v) {
        if (toString.call(v) !== "[object String]") {
            v = JSON.stringify(v);
        }
        return k + "=" + v + "\n";
    }


    function sanitizeUrl(str) {
        // console.log("This is the str: \n" + str)
        var n = str.split(' ').join('-')
        // console.log(n);
        return n;
    }







}; // END OF VOICE CONTROLLER
