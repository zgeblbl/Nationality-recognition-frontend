# Frontend for Face Recognition and Nationality Prediction

This repository contains the frontend code for the Face Recognition and Nationality Prediction application. The frontend provides an interface for capturing images and displaying the nationality prediction results from the backend.

## Structure
```
index.html     # Main HTML file with a facial recognition loading screen 
app.js         # JavaScript file with logic and updates to the loading screen 
style.css      # CSS file with styles for the application, including result text and loading screens 
bg-art-5.png   # Background image used in the application 
minilogo.png   # Logo image for the application
```
## Installation

1. **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Open `index.html` in Your Web Browser:**
    - Navigate to the directory containing `index.html`.
    - Double-click on `index.html` to open it in your web browser. This will start the frontend application.

## Usage

1. **Access the Application:**
    - Open the frontend by double-clicking `index.html`. This will load the application in your web browser.

2. **Capture or Upload an Image:**
    - Use the interface to capture an image using your camera.

3. **View Results:**
    - The frontend will communicate with the backend (running at `http://localhost:5000`) to process the image and display the nationality prediction results.

## Backend

The backend for this application is available in a separate repository. You need to set up and run the backend server to handle image processing and provide predictions.

- **Backend Repository:** [Face Recognition and Nationality Prediction Backend](<https://github.com/zgeblbl/Nationality-recognition-backend.git>)


## Testing

1. **Verify the Frontend Interface:**
    - Ensure the frontend is correctly displayed, including the loading screens and result text.

2. **Ensure Backend Connectivity:**
    - Make sure the backend server is running at `http://localhost:5000` to process image requests and return predictions.

## Authors

- Özge Bülbül
- Samet Emin Özen
