const video = document.getElementById('camera');
const captureButton = document.getElementById('capture');
const resultElement = document.getElementById('result');

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();  // Ensure video is playing
  })
  .catch(err => {
    console.error("Error accessing webcam: ", err);
    resultElement.innerText = "Error accessing webcam.";
  });

// Capture image and send it to the backend
captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the image to a data URL
  const imageDataUrl = canvas.toDataURL('image/jpeg');

  // Send the image data to the backend for prediction
  fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: imageDataUrl })
  })
  .then(response => response.json())
  .then(data => {
    resultElement.innerText = `Prediction: ${data.prediction}`;
  })
  .catch(error => {
    console.error('Error:', error);
    resultElement.innerText = "Error processing prediction.";
  });
});
