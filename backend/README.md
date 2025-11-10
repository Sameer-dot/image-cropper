# Image Border Tool - Backend

Node.js/Express backend API for processing images and adding borders.

## Features

- Image upload handling
- Image merging and composition
- Border rendering using SVG overlays
- File cleanup and management
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sharp** - High-performance image processing
- **Multer** - File upload middleware

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the backend directory (optional):

```env
PORT=3000
BASE_URL=http://localhost:3000
```

- `PORT`: Server port (default: 3000, Render provides this automatically)
- `BASE_URL`: Base URL for image URLs (default: http://localhost:3000). On Render, set this to your Render service URL (e.g., `https://your-backend.onrender.com`)

## API Endpoints

### POST /api/process-image

Processes an image by merging a cropped region back onto the original and adding a border.

**Request:**
- Content-Type: `multipart/form-data`
- `originalImage` (file): Original image file
- `croppedImage` (file): Cropped image blob
- `cropX` (number): X coordinate of crop area
- `cropY` (number): Y coordinate of crop area
- `cropWidth` (number): Width of crop area
- `cropHeight` (number): Height of crop area
- `borderColor` (string): Hex color code for border (default: #000000)
- `borderWidth` (number): Border width in pixels (default: 3)

**Response:**
```json
{
  "imageUrl": "http://localhost:3000/images/imageoutput-1234567890.jpeg"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── image.js          # Image processing route
│   └── server.js             # Express server setup
├── uploads/                  # Temporary upload directory (auto-created)
├── outputs/                  # Processed images directory (auto-created)
└── package.json
```

## File Handling

- Uploaded files are temporarily stored in `uploads/` directory
- Processed images are saved in `outputs/` directory
- Temporary files are automatically cleaned up after processing
- Static files in `outputs/` are served at `/images/` endpoint

## Configuration

- **Max file size**: 10MB (configurable in `src/routes/image.js`)
- **JPEG quality**: 90% (configurable)
- **Default border color**: #000000
- **Default border width**: 3px

## Deployment to Render

### Using Render Dashboard

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Configure settings:**
   - **Name**: image-border-tool-backend (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Root Directory**: `backend` (if deploying from monorepo)

4. **Add environment variables:**
   - `BASE_URL` = Your Render service URL (e.g., `https://your-backend.onrender.com`)
   - `PORT` is automatically set by Render

5. **Deploy**

### Using Render CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
render deploy
```

## CORS Configuration

The server is configured to accept requests from all origins. For production, consider restricting CORS to your frontend domain:

```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app'
}));
```

## Health Check

The server responds to all routes. You can add a health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

## Troubleshooting

- **Port conflicts**: Change PORT in environment variables
- **File upload issues**: Check file size limits and disk space
- **Sharp installation**: Ensure system dependencies are installed (libvips)
- **Memory issues**: Large images may require increased memory limits

## Production Considerations

- Set up proper error logging (e.g., Winston, Pino)
- Implement rate limiting
- Add request validation middleware
- Set up monitoring and alerts
- Configure proper CORS origins
- Consider using a CDN for serving processed images
- Implement file cleanup cron job for old files

