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
async function captureImage() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg'); // Return base64 encoded image
  
}

// Function to capture images and send them to the backend
async function captureAndSendImages(numImages, delay) {
  const images = [];
  let countdownValue = Math.ceil((numImages * delay) / 1000); // Convert total time to seconds
  countdownElement.innerText = countdownValue;

  loadingScreen.style.display = 'flex'; // Show loading screen

  // Countdown function
  const countdownInterval = setInterval(() => {
    countdownValue--;
    countdownElement.innerText = countdownValue;
    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  for (let i = 0; i < numImages; i++) {
    const image = await captureImage();  // Capture image from the video stream
    if (image) {
      images.push(image);
    }

    // Batch send images every 5 captures or after final image
    if (i === numImages - 1) {
      await sendImages(images.splice(0, 5));  // Send and clear batch
    }

    await new Promise(resolve => setTimeout(resolve, delay));  // Wait before next capture
  }

  loadingScreen.style.display = 'none'; // Hide loading screen after captures
}

// Function to send images to the backend
async function sendImages(imagesBatch) {
  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images: imagesBatch })
    });

    const data = await response.json();
    // Clear previous result
    resultElement.innerText = "";

    // Show new result
    resultElement.innerText = `${data.most_common_prediction}`;
    resultElement.classList.add('prediction-received');
    resultElement.style.fontSize = "36px";
  } catch (error) {
    console.error('Error:', error);
    resultElement.innerText = "Error processing prediction.";
  } finally {
    // Hide loading screen after prediction is processed
    loadingScreen.style.display = 'none';
  }
}

// Event listener for capture button
captureButton.addEventListener('click', async () => {
  resultElement.innerText = "";
  captureButton.disabled = true;
  await captureAndSendImages(20, 200);  // Capture 20 images with a 200ms delay

  setTimeout(() => {
    captureButton.disabled = false;
  }, 2000);
});
