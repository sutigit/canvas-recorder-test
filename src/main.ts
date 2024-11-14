import StatMapDisplay, { Country, AdministrativeLevel } from 'stat-map-display';


// create map element
const targetEl = document.createElement('div');
targetEl.id = 'map';
targetEl.style.height = '90vh';
targetEl.style.aspectRatio = '9/16';
document.body.appendChild(targetEl);

const view = new StatMapDisplay({
  id: 'map',
  country: Country.FINLAND,
  administrativeLevel: AdministrativeLevel.MUNICIPALITY,
  style: {
    strokeWidth: 0.2,
  },
});


// RECORDING SYSTEM ---------------------------------------------------------------------
// create button
const button = document.createElement('button');
button.textContent = 'Record';
document.querySelector('#app')?.appendChild(button);

// record
let isRecording = false;
let chunks: Blob[] = [];
let stream: MediaStream;
let mediaRecorder: MediaRecorder;

button.addEventListener('click', async () => {
  const canvas = view.getCanvas();

  if (canvas && !isRecording) {
    // Start recording
    isRecording = true;
    button.textContent = 'Stop Recording';


    // Set up the stream and MediaRecorder
    stream = canvas.captureStream(24);
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/mp4',
      bitsPerSecond: 50000000,
      audioBitsPerSecond: 0,
    });

    chunks = []; // Reset the chunks

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      // Create a Blob from the chunks
      const videoBlob = new Blob(chunks, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);

      // Create a download link for the video
      const downloadLink = document.createElement('a');
      downloadLink.href = videoUrl;
      downloadLink.download = 'recording.mp4';
      downloadLink.textContent = 'Download Video';
      document.querySelector('#app')?.appendChild(downloadLink);
    };

    mediaRecorder.start();
  } else {
    // Stop recording
    isRecording = false;
    button.textContent = 'Record';
    mediaRecorder.stop();
  }
});

