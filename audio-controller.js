var Audio = require('node-core-audio');

var sample = 0;
var ampBuffer = new Float32Array(4000);

function processAudio( inputBuffer ) {
    // Just print the value of the first sample on the left channel
    console.log( inputBuffer[0][0] );
    
    var output = [];
    for (var i = 0; i < inputBuffer.length; i++, sample++) {
        //Pan two sound-waves back and forth, opposing
        var val1 = Math.sin(sample * 110.0 * 2 * Math.PI / 44100.0) * 0.25, val2 = Math.sin(sample * 440.0 * 2 * Math.PI / 44100.0) * 0.25;
        var pan1 = Math.sin(1 * Math.PI * sample / 44100.0), pan2 = 1 - pan1;

        output.push(val1 * pan1 + val2 * pan2); //left channel
        output.push(val1 * pan2 + val2 * pan1); //right channel

        //Save microphone input into rolling buffer
        ampBuffer[sample%ampBuffer.length] = inputBuffer[i];
    }
    console.log(output);
    return output;
}

var engine = Audio.createNewAudioEngine();
engine.setOptions({ inputChannels: 1, outputChannels: 2, interleaved: true });

engine.addAudioCallback( processAudio );