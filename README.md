# 📱 React Native Expo Assignment

## WebView + Notifications + Video Player

A full-featured mobile application built with Expo featuring WebView integration, local notifications, and HLS video streaming with custom controls.

---

## 🎯 Project Overview

**Tech Stack:** React Native • Expo • TypeScript • Expo Router  
**Status:** ✅ All requirements + All bonus features completed

### Core Features

- ✅ WebView integration with Google.com
- ✅ Two local notifications (3s & 5s delays)
- ✅ HLS video player with custom controls
- ✅ Smooth navigation between screens

### ⭐ Bonus Features Implemented

- ✅ WebView load notification
- ✅ Notification tap → Video player navigation
- ✅ Custom video controls (seek slider, ±10s skip, mute)
- ✅ Auto-resume playback after seeking

---

## 📁 Project Structure

```
Webview-Noti/
├── app/
│   ├── _layout.tsx      # Root navigation (Stack)
│   ├── index.tsx        # Home (WebView + Notifications)
│   └── video.tsx        # Video Player (HLS)
├── index.js             # Entry point
├── app.json             # Expo config
└── README.md
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install required packages
npx expo install expo-router react-native-webview expo-notifications expo-av @react-native-community/slider

# Start development server
npx expo start

# Scan QR code with Expo Go app
```

---

## 📱 Features Breakdown

### 1. Home Screen (WebView + Notifications)

**Components:**

- Embedded Google.com in WebView
- Three action buttons:
  - 🔔 Welcome Notification (3s delay)
  - 🎬 Video Notification (5s delay + tap navigation)
  - ▶️ Direct Video Player navigation

**Technical Implementation:**

```typescript
// Notification scheduling with delays
await Notifications.scheduleNotificationAsync({
  content: { title, body, data },
  trigger: { seconds: 3 },
});

// Tap listener for navigation
Notifications.addNotificationResponseReceivedListener((response) => {
  if (response.notification.request.content.data?.screen === "video") {
    router.push("/video");
  }
});
```

---

### 2. Video Player Screen

**Control Layout:**

```
┌─────────────────────────────┐
│   [HLS Video Stream]        │  ← 280px height
├─────────────────────────────┤
│   0:45 / 3:20  ▶️ Playing   │  ← Time + Status
├─────────────────────────────┤
│   ━━━━━●━━━━━━━━━━━━        │  ← Draggable slider
├─────────────────────────────┤
│   ⏪  -10s  |  ▶️  |  +10s ⏩ │  ← Skip controls
├─────────────────────────────┤
│   🔊 Mute  |  ⛶ Full  |  🔙  │  ← Extra controls
└─────────────────────────────┘
```

**Key Features:**

- Custom seek slider (drag to any position)
- Skip controls (±10 seconds)
- Auto-resume after seeking (video doesn't pause)
- Mute/Unmute toggle
- Fullscreen mode
- Real-time progress updates

**Auto-Resume Logic:**

```typescript
const wasPlaying = status.isPlaying;
await videoRef.current.setPositionAsync(newPosition);
if (wasPlaying) {
  await videoRef.current.playAsync();
}
```

---

## 🛠 Technology Stack

| Package                          | Purpose               |
| -------------------------------- | --------------------- |
| `expo-router`                    | File-based navigation |
| `react-native-webview`           | Website embedding     |
| `expo-notifications`             | Local notifications   |
| `expo-av`                        | HLS video playback    |
| `@react-native-community/slider` | Custom seek control   |

---

## ✅ Requirements Checklist

### Core Requirements

- [x] WebView page with embedded website
- [x] Two distinct notifications with delays (3s, 5s)
- [x] HLS video player with play/pause/fullscreen
- [x] Navigation between screens
- [x] Clean code structure
- [x] Works in Expo Go

### Bonus Features

- [x] WebView load notification
- [x] Notification tap opens video player
- [x] Custom video controls (seek, skip, mute)
- [x] Smooth seeking without pausing

---

## 🧪 Testing Guide

### Quick Test Checklist

1. ✅ App launches and loads Google.com
2. ✅ Green button → Wait 3s → Welcome notification
3. ✅ Orange button → Wait 5s → Video notification
4. ✅ Tap notification → Video page opens
5. ✅ Video plays with all controls working
6. ✅ Seek/skip without pausing video
7. ✅ Back button returns to home

### Run Tests

```bash
# Clear cache and restart
npx expo start --clear

# Test on Android
npx expo start --android

# Test on iOS (macOS only)
npx expo start --ios
```

---

## 🎨 Design Choices

**Color Scheme:**

- Green (#4CAF50) - Welcome/positive actions
- Orange (#FF9800) - Important notifications
- Blue (#2196F3) - Navigation/primary actions
- Dark theme - Video player (better viewing)

**Technical Decisions:**

- **Expo Router:** Simpler than React Navigation
- **TypeScript:** Type safety for video status
- **Custom Controls:** Better UX control
- **Local Notifications:** No Firebase needed

---

## 🐛 Troubleshooting

**Issue: Notifications not appearing**

```bash
Solution: Check app notification permissions in device settings
```

**Issue: "Unmatched route" error**

```bash
Solution:
npx expo start --clear
rm -rf .expo
```

**Issue: Video not loading**

```bash
Solution: Check internet connection (HLS requires stable network)
```

---

## 📊 Code Quality

- ✅ Professional naming conventions
- ✅ JSDoc comments for all functions
- ✅ Error handling with try-catch
- ✅ TypeScript for type safety
- ✅ Console logging for debugging
- ✅ Accessibility labels
- ✅ Clean component structure

---

## 🎯 Key Highlights (For Interview)

1. **All bonus features implemented** - Extra credit earned
2. **Auto-resume seeking** - Video doesn't pause when skipping
3. **Interactive notifications** - Tap to navigate
4. **Custom video controls** - YouTube-like experience
5. **Professional code structure** - Enterprise-ready
6. **Type-safe** - TypeScript throughout
7. **Accessible** - Screen reader support

---

## 📝 Demo Script

```
1. "Home screen with Google.com embedded in WebView"
2. "Green button schedules notification in 3 seconds"
3. "Orange button schedules notification in 5 seconds"
4. "Tapping notification navigates to video player"
5. "Video plays with custom controls"
6. "Seek slider works like YouTube"
7. "Skip buttons don't pause video (bonus feature)"
8. "Mute and fullscreen controls available"
```

---

## 📦 Dependencies

```json
{
  "expo": "~51.0.0",
  "expo-router": "^3.5.0",
  "expo-notifications": "~0.28.0",
  "expo-av": "~14.0.0",
  "react-native-webview": "13.8.6",
  "@react-native-community/slider": "4.5.2"
}
```

---

## 🚀 Deployment

```bash
# Build for production
eas build --platform android
eas build --platform ios

# Publish update
eas update
```

---

## 👨‍💻 Developer

**Name:** [Rahil Shaikh]  
**Email:** [sr9851415@gmail.com]  
**Status:** ✅ Complete & Ready for Submission

---

## 📄 License

Created for educational purposes as part of a React Native assignment.

---

**Last Updated:** January 2025 | **Version:** 1.0.0
