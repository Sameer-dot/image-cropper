# Image Editor

A simple tool for editing images. Upload an image, select a region, and add a custom border around it.

## Overview

This application allows you to:

- Upload images (JPG, PNG, WebP, GIF)
- Select a specific area of the image
- Add a customizable border around the selected area
- Download the final edited image

## Getting Started

### Requirements

- Node.js (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- npm (comes with Node.js)

### Installation

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to the project folder
3. Run: `npm run install:all`

### Running the Application

1. Run: `npm run dev`
2. Open your browser and go to `http://localhost:5173`

The application will start both the server and the web interface.

## How to Use

1. **Upload** - Click the upload area or drag and drop an image
2. **Select Region** - Drag and resize the selection box to choose the area
3. **Customize Border** - Choose color and width
4. **Process** - Click "Process Image" and wait
5. **Download** - Click "Download Image" to save the result

## Troubleshooting

**Port already in use?**

- Mac/Linux: `lsof -ti:3000 | xargs kill -9`
- Windows: End Node.js processes in Task Manager

**Won't start?**

- Make sure Node.js is installed: `node --version`
- Make sure you ran `npm run install:all` first

**To stop the application:** Press `Ctrl + C` in the terminal
