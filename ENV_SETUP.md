# Environment Variables Setup

Create a `.env.local` file in the `frontend` directory with the following variables:

## Required Variables

### API Configuration
```
NEXT_PUBLIC_API_BASE=https://tracker-backend-elpr.onrender.com
```
Base URL for all backend API calls.

### OTP Configuration (2Factor.in)
```
NEXT_PUBLIC_OTP_API_KEY=your_2factor_api_key_here
```
API key from [2factor.in](https://2factor.in/) for OTP verification during signup.

### Google Maps
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
Google Maps API key for map display.

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```
Firebase configuration for push notifications (FCM).

## Example .env.local file

```env
# API Base URL
NEXT_PUBLIC_API_BASE=https://tracker-backend-elpr.onrender.com

# 2Factor OTP API
NEXT_PUBLIC_OTP_API_KEY=your_2factor_api_key_here

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAdXMi37-Rv-0hV6teopW2FMwoud9mjGaU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=svdd-c3198.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=svdd-c3198
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=svdd-c3198.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=849894574211
NEXT_PUBLIC_FIREBASE_APP_ID=1:849894574211:web:2e8465d84311bdceb3b3b6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8RYP5L2D6P
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BKGT4LvlZ6wiOx6m_zXzvZieShQo5Bh0ZEPF5YqUQJc2IsDnzfG68cqCdifs4r7iLvmmrV_rQeogni2Hr9Yhxc4
```

## Getting API Keys

### 2Factor OTP API
1. Sign up at [2factor.in](https://2factor.in/)
2. Get your API key from the dashboard
3. Add it to `NEXT_PUBLIC_OTP_API_KEY`

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Maps JavaScript API
3. Create an API key
4. Add it to `GOOGLE_MAPS_API_KEY`

### Firebase
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firebase Cloud Messaging (FCM)
3. Copy the configuration values to the respective environment variables
