# Quick Setup Guide

## Steps to Run the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Get OpenWeatherMap API Key**
   - Visit https://openweathermap.org/api
   - Sign up for a free account
   - Get your API key from the dashboard

3. **Create Environment File**
   - Create a file named `.env.local` in the root directory
   - Add your API key:
     ```
     NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
     ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to http://localhost:3000

## Features to Test

- ✅ Search for any city
- ✅ Click "Use My Location" to auto-detect location
- ✅ Toggle between °C and °F
- ✅ Toggle dark/light mode
- ✅ View 5-day forecast
- ✅ Browse 25 popular cities in the table
- ✅ Use pagination in the cities table

## Troubleshooting

- **API Key Error**: Make sure `.env.local` exists and contains `NEXT_PUBLIC_WEATHER_API_KEY`
- **Location Not Working**: Allow location permissions in your browser
- **Build Errors**: Make sure all dependencies are installed with `npm install`

