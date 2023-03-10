const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext('2d');

const audio = document.getElementById("audio");
audio.volume = 0.5;

/**
 * @type AudioContext
 */
let audioCtx;
let track;
let gain;
let analyzer;
let dataArray;
let bufferLength;
let initialized = false;

audio.addEventListener("play", () => 
{ 
    initalizeAudioContext();
    updateFreuqency();
});

function updateFreuqency()
{
    // if (audio.paused)
    //     return;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
    analyzer.getByteFrequencyData(dataArray);

    const width = 2;
    const gap = width;
    const bars = bufferLength / ((width + gap) - gap);

    let x = 0;
    for (let i = 0; i < bars; i++)
    {
        const perc = dataArray[i] / 255
        const height = perc * canvas.height;
        x += width + gap;

        // remove gap
        // x-= gap;

        const progress = (audio.currentTime / audio.duration);
        const bari = x / canvas.width;

        canvasCtx.fillStyle = `rgba(255, 255, 255, ${progress > bari ? 1 : 0.25} )`;
        
        // Different visuals
        canvasCtx.fillRect(x, (canvas.height / 2) - (height / 2), width, height);
        // canvasCtx.fillRect(x, canvas.height - height, width, height);
        // canvasCtx.fillRect(x, canvas.height - height, width, width*4);
    }

    requestAnimationFrame(updateFreuqency);
}

function initalizeAudioContext()
{
    if (initialized)
        return;
    
    initialized = true;
    audioCtx = new AudioContext();
    
    track = audioCtx.createMediaElementSource(audio);
    gain = audioCtx.createGain();
    analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 1024*4
    
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    analyzer.getByteFrequencyData(dataArray);
    track
        .connect(gain)
        .connect(analyzer)
        .connect(audioCtx.destination);
}
