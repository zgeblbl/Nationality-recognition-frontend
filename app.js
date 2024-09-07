const video = document.getElementById('camera');
const captureButton = document.getElementById('capture');
const resultElement = document.getElementById('result');
const loadingScreen = document.getElementById('loading');
const countdownElement = document.getElementById('countdown');

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

function captureAndSendImages(numImages, delay) {
  const images = [];
  let isProcessing = false;
  
  // Show loading screen
  loadingScreen.style.display = 'flex';
  
  let countdownValue = Math.ceil((numImages * delay) / 1000); // Convert total time to seconds
  countdownElement.innerText = countdownValue;

  // Countdown function
  const countdownInterval = setInterval(() => {
    countdownValue--;
    countdownElement.innerText = countdownValue;
    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  function capture(index) {
    if (index < numImages) {
      images.push(captureImage());

      if (images.length % 5 === 0 || index === numImages - 1) {
        // Send batch of 5 images or the final batch
        if (!isProcessing) {  // Check if not already processing
          isProcessing = true;
          sendImages(images.splice(0, 5));  // Clear array after sending batch
        }
      }

      setTimeout(() => capture(index + 1), delay);
    } else {
      // Hide loading screen once processing is done
      loadingScreen.style.display = 'none';
    }
  }

  capture(0);
}

// Function to send images to the backend
function sendImages(imagesBatch) {
  isProcessing = true;
  fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ images: imagesBatch })
  })
  .then(response => response.json())
  .then(data => {
    // Clear previous result
    resultElement.innerText = "";
    // Show new result
    resultElement.innerText = `${data.prediction}`;
    resultElement.classList.add('prediction-received');
    resultElement.style.fontSize = "36px";
  })
  .catch(error => {
    console.error('Error:', error);
    resultElement.innerText = "Error processing prediction.";
  })
  .finally(() => {
    isProcessing = false;  // Reset processing flag
  });
}

// Capture 20 images with 50ms delay and send them in batches
captureButton.addEventListener('click', () => {
  captureButton.disabled = true;
  captureAndSendImages(20, 50);  // Reduced the number of captures and delay

  setTimeout(() => {
    captureButton.disabled = false;
  }, 2000);
});
