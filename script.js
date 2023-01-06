const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext('2d');

const audio = document.getElementById("audio");

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
    analyzer.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const width = 2;
    const gap = width;
    const bars = bufferLength / ((width + gap) - gap);

    let x = 0;
    for (let i = 0; i < bars; i++)
    {
        const perc = (dataArray[i] * 100) / 255
        const height = (perc * canvas.height) / 100;
        x += width + gap;

        canvasCtx.fillStyle = "rgba(0, 0, 0, 1)";
        canvasCtx.fillRect(x, canvas.height - height, width, height);
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
    analyzer.fftSize = 4096
    
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    analyzer.getByteFrequencyData(dataArray);
    track
        .connect(gain)
        .connect(analyzer)
        .connect(audioCtx.destination);
}
