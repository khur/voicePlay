/**
 *  Module
 *
 * Description
 */
angular.module('voicePlay', [])
    .controller('voiceController', voiceController);

function voiceController() {
    var ctrl = this;
    





    // Microphone from Wit.ai api

    var mic = new Wit.Microphone(document.getElementById("microphone"));

    var info = function (msg) {
        document.getElementById("info").innerHTML = msg;

    };

    var error = function (msg) {
      document.getElementById("error").innerHTML = msg;
    };
    mic.onready = function () {
      info("Microphone is ready to record");
    };
    mic.onaudiostart = function () {
      info("Recording started");
      error("");
    };
    mic.onaudioend = function () {
      info("Recording stopped, processing started");
    };
    mic.onresult = function (intent, entities) {
      var r = kv("intent", intent);

      console.log("enitities \n");
      console.dir(entities);

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
      artist = entities.artist.body;
      document.getElementById("result").innerHTML = r;
      
      // Embeds SoundCloud widget on result of search
      SC.initialize({
        client_id: 'YOUR_CLIENT_ID'
      });

      var track_url = 'http://soundcloud.com/' + artist;

      console.log("track url: " + track_url);
      SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
        console.log('oEmbed response: ' + oEmbed);
        console.dir(oEmbed);
        document.getElementById("soundCloud").innerHTML = oEmbed.html;
      });


    };


    mic.onerror = function (err) {
      error("Error: " + err);
    };

    mic.onconnecting = function () {
      info("Microphone is connecting");
    };

    mic.ondisconnected = function () {
      info("Microphone is not connected");
    };

    mic.connect("H5QMXAT27JD7BXIFPF5EIFU23VT2XFTV");
    // mic.start();
    // mic.stop();

    function kv (k, v) {
      if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
      }
      return k + "=" + v + "\n";
    }

    








}; // END OF VOICE CONTROLLER
