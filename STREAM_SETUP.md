# Stream.io Video Calling Setup Guide

## 🚨 **Issues Found & Solutions:**

### 1. **401 Unauthorized Error** 
**Cause:** Backend video routes exist but middleware was not handling Bearer tokens correctly
**Solution:** ✅ Fixed the `authUserOrLawyer` middleware in `videoRoutes.js`

### 2. **Missing Environment Variables**
You need to add these to your `Backend/.env` file:

```bash
# Stream.io Configuration (Required for Video Calling)
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_secret_here
```

### 3. **Backend Restart Required**
After adding the environment variables, restart your backend server:

```bash
cd Backend
pnpm start
```

## 🎯 **How to Get Stream.io Credentials:**

1. **Go to Stream.io Dashboard:** https://getstream.io/
2. **Create Account/Login**
3. **Create a New App** or use existing one
4. **Go to Dashboard > Your App > Overview**
5. **Copy API Key and Secret:**
   - API Key: `STREAM_API_KEY`
   - Secret: `STREAM_API_SECRET`

## 🔧 **Current Status:**

✅ Video call buttons showing (1 eligible appointment found)
✅ Frontend routes configured (`/video-call/:appointmentId`)
✅ Admin routes configured (`/lawyer/video-call/:appointmentId`) 
✅ Backend video controller exists
✅ Stream.io SDKs installed (Frontend & Backend)
✅ Video routes middleware fixed
❌ Need Stream.io environment variables
❌ Need backend restart

## 🚀 **Next Steps:**

1. **Add Stream.io credentials** to `Backend/.env`
2. **Restart backend server**
3. **Test video calling** - should work!

## 📋 **Your Current Appointment Status:**
- ✅ 1 appointment eligible for video calling
- Payment: true, Cancelled: "Not Cancelled", Completed: false