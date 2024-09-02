const video = document.getElementById('camera');
const captureButton = document.getElementById('capture');
const resultText = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Camera access denied:", err);
  });

// Capture image and send for prediction
captureButton.addEventListener('click', () => {
  // Here, you would capture the video frame, process it, and send it to your model
  // After processing, display the result
  resultText.textContent = "Processing...";

  setTimeout(() => {
    resultText.textContent = "Predicted Nationality: Turkish";
  }, 2000);
});
