const video = document.getElementById('camera');
const captureButton = document.getElementById('capture');
const resultElement = document.getElementById('result');

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing webcam: ", err);
  });

// Function to capture an image from the video
function captureImage() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');  // Return base64 encoded image
}

// Function to capture images with delay
function captureImagesWithDelay(numImages, delay, callback) {
  const images = [];
  
  function capture(index) {
    if (index < numImages) {
      images.push(captureImage());
      setTimeout(() => capture(index + 1), delay);
    } else {
      callback(images);
    }
  }

  capture(0);
}

// Capture 20 images with 0.1 sec delay and send to backend
captureButton.addEventListener('click', () => {
  captureImagesWithDelay(20, 100, images => {
    // Send images to backend
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images: images })
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
});
