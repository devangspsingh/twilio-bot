# WhatsApp Review Collector - Frontend

A modern React + Vite frontend application that displays product reviews collected via WhatsApp.

## 📋 Project Overview

This frontend provides a beautiful, responsive interface to view all product reviews submitted through the WhatsApp bot. It features:
- Real-time review display
- Responsive card-based layout
- Auto-refresh functionality
- Error handling with fallback mock data
- Clean UI with Tailwind CSS and Lucide icons

## 🏗️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will start at `http://localhost:5173`

## 📡 API Integration

The frontend connects to the FastAPI backend at:
```
http://localhost:8000/api/reviews
```

Make sure your backend is running before starting the frontend. If the backend is unavailable, the app will display mock data for preview purposes.

### Changing API Endpoint

To change the API endpoint, update the fetch URL in `src/App.jsx`:
```javascript
const response = await fetch('http://your-backend-url/api/reviews');
```

## 🎨 Features

### Review Display
- **User Information**: Shows user name and contact number
- **Product Details**: Displays the product being reviewed
- **Review Content**: Full review text
- **Timestamps**: Shows when the review was submitted
- **Status Indicators**: Displays message delivery status

### Auto-Refresh
- Reviews are automatically fetched every 30 seconds
- Manual refresh button available

### Error Handling
- Graceful error messages when backend is unavailable
- Fallback to mock data for development/preview

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Beautiful card-based layout

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # React entry point
│   ├── global.css      # Global styles (Tailwind imports)
│   └── assets/         # Images and other assets
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint configuration
└── README.md           # This file
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder.

### Preview
```bash
npm run preview
```
Preview the production build locally.

### Lint
```bash
npm run lint
```
Run ESLint to check for code quality issues.

## 🎨 UI Components

### Review Card
Each review is displayed in a card with:
- **Header**: User name and WhatsApp icon
- **Product**: Product name with box icon
- **Review**: Full review text
- **Footer**: Timestamp and contact number

### Loading State
- Animated spinner while fetching data
- "Loading reviews..." message

### Error State
- Error icon and message when API fails
- Automatic fallback to mock data

### Empty State
- Displays when no reviews are available
- Instructions to start submitting reviews

## 🔧 Development

### Adding New Features

1. **Update App.jsx** for new functionality
2. **Use Tailwind CSS** classes for styling
3. **Import Lucide icons** as needed:
   ```javascript
   import { IconName } from 'lucide-react';
   ```

### Customizing Styles

Global styles are in `src/global.css`. Tailwind utility classes can be used directly in JSX:
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Content here
</div>
```

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Update API endpoint** to production URL in `App.jsx`

4. **Configure CORS** in the backend to allow requests from your frontend domain

## 🔗 Connecting to Backend

Ensure the backend is running and accessible:

1. **Local Development:**
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:5173`

2. **Production:**
   - Update fetch URL in `App.jsx` to your production backend URL
   - Ensure backend CORS settings allow your frontend domain

## 📱 Responsive Breakpoints

The app uses Tailwind's default breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🎯 Key Features Explained

### Auto-Refresh
```javascript
useEffect(() => {
  const interval = setInterval(fetchReviews, 30000);
  return () => clearInterval(interval);
}, []);
```
Reviews refresh every 30 seconds automatically.

### Error Boundaries
The app handles API errors gracefully and falls back to mock data for a better developer experience.

### Status Display
Shows Twilio message delivery status (pending, delivered, failed, etc.).

## 🐛 Troubleshooting

### Backend Connection Error
**Issue:** "Could not fetch reviews. Ensure the backend is running."

**Solution:**
1. Check if backend is running: `http://localhost:8000/docs`
2. Verify CORS settings in backend allow `http://localhost:5173`
3. Check browser console for detailed error messages

### Build Errors
**Issue:** Build fails with dependency errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
**Issue:** Port 5173 is already in use

**Solution:**
```bash
# Kill the process using port 5173, or
# Vite will automatically use the next available port
```

## 📝 License

MIT License

## 👨‍💻 Author

Built to showcase modern React development with clean UI/UX and external API integration.
