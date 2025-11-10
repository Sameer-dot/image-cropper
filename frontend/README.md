# Image Border Tool - Frontend

React frontend application for selecting image regions and adding custom borders.

## Features

- Image upload with drag-and-drop support
- Interactive crop selection with zoom controls
- Customizable border color and width
- Real-time image processing
- Download processed images
- Clean, professional UI

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **react-easy-crop** - Image cropping component

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

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

For production, set `VITE_API_URL` to your backend API URL (e.g., `https://your-backend.onrender.com`)

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ColorPicker.jsx      # Border color picker
│   │   ├── ImageCropper.jsx     # Image cropping component
│   │   └── ImageUpload.jsx      # File upload component
│   ├── utils/
│   │   └── cropImage.js         # Image cropping utility
│   ├── App.jsx                   # Main application component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

## Deployment to Vercel

1. **Connect your repository** to Vercel
2. **Set build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add environment variable:**
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.onrender.com`)

4. **Deploy**

Vercel will automatically deploy on every push to your main branch.

## API Integration

The frontend communicates with the backend API at `/api/process-image` endpoint. Make sure your backend is running and accessible at the URL specified in `VITE_API_URL`.

## Troubleshooting

- **CORS errors**: Ensure your backend has CORS enabled and allows requests from your frontend domain
- **API connection issues**: Verify `VITE_API_URL` is set correctly
- **Build failures**: Check Node.js version (requires 18+)

