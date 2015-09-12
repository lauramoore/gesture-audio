var Audio = require('node-core-audio');
var Myo = require('myo');

var sample = 0;
var ampBuffer = new Float32Array(4000);
var pitchLow = 88200.0;//22050.0; //44100.0
var pitchHigh = 22050.0;

Myo.on('gyroscope', function(data) {
   console.log( data);
});

Myo.on('fist', function(data) {
   startAudio();
});

Myo.on('connect', function(){
   Myo.unlock();
});


Myo.connect();



function processAudio( inputBuffer ) {
    // Just print the value of the first sample on the left channel
    console.log( inputBuffer[0][0] );
    var pitch =  pitchHigh; //Math.floor(Math.random() * (pitchHigh - pitchLow + 1)) + pitchLow;
    
    var output = [];
    for (var i = 0; i < inputBuffer.length; i++, sample++) {
        //Pan two sound-waves back and forth, opposing
        var val1 = Math.sin(sample * 110.0 * 2 * Math.PI / pitch) * 0.25, val2 = Math.sin(sample * 440.0 * 2 * Math.PI / pitch) * 0.25;
        var pan1 = Math.sin(1 * Math.PI * sample / pitch), pan2 = 1 - pan1;

        output.push(val1 * pan1 + val2 * pan2); //left channel
        output.push(val1 * pan2 + val2 * pan1); //right channel

        //Save microphone input into rolling buffer
        ampBuffer[sample%ampBuffer.length] = inputBuffer[i];
    }
    console.log(output);
    return output;
}

function startAudio() {
  var engine = Audio.createNewAudioEngine();
  engine.setOptions({ inputChannels: 1, outputChannels: 2, interleaved: true });

  engine.addAudioCallback( processAudio );
}


