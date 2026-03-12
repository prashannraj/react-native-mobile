# 🎬 React Native Mobile App (Over-The-Top) OTT Netflix style

![React Native Mobile App](https://user-images.githubusercontent.com/prashannraj/your-repo-cover.png)

A modern **React Native** OTT-style mobile app built with **Expo** and **Expo Router**. Browse movies, see details, and watch videos with a beautiful, responsive interface.

---

## 📊 Badges

![Expo](https://img.shields.io/badge/Expo-Managed-orange)  
![React Native](https://img.shields.io/badge/React_Native-0.71-blue)  
![License](https://img.shields.io/badge/License-MIT-green)  
![Build Status](https://img.shields.io/badge/EAS_Build-Pending-yellow)

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Installation & Running](#-install--run-android)
5. [Android APK Build](#-android-apk-build)
6. [Environment Variables](#-environment-variables)
7. [Contributing](#-contributing)
8. [License](#-license)

---

## 🚀 Features

- 🎬 **Movie Listing & Detail Pages**
- 📽️ **Watch Now Button** – Opens video playback screen
- 📍 **Expo Router Navigation** – File-based routing with params
- 🧠 **API Integration** – Fetches and cleans movie URLs
- 📱 **Android Support** – APK ready for local testing
- 🔥 **Loading and Error States** – Loader and error handling
- 🖼️ **Fallback Images** – Gracefully handles missing images

---

## 🧰 Tech Stack

- **React Native** – Cross-platform UI framework ([React Native](https://reactnative.dev/))
- **Expo Managed Workflow** – Simplified development & builds ([Expo](https://expo.dev/))
- **Expo Router** – File-based routing ([Docs](https://docs.expo.dev/router/introduction/))
- **Lucide React Native** – Icons library ([Lucide](https://lucide.dev/))
- **Axios** – HTTP client for API requests

---

## 📁 Project Structure

## 📁 Project Structure
react-native-mobile/
├── app/ # Expo Router navigation structure
├── assets/ # Images and static assets
├── src/ # Source code for services and utilities
├── .gitignore
├── App.js # Entry point
├── app.json # Expo config
├── package.json # Dependencies and scripts
└── eas.json # EAS build config

---

## 📌 Install & Run (Android)

This project uses **Expo** and **EAS Build** to generate builds.

### Clone Repo

```bash
git clone https://github.com/prashannraj/react-native-mobile.git
cd react-native-mobile
Install Dependencies
**npm install**

Run App in Development (Fast Preview)

Make sure you have Expo Go installed on your Android device:
npx expo start

Android APK Build (For Local Testing Only)

Use EAS CLI to generate a standalone release build (APK):

npm install -g eas-cli
npx eas build -p android --profile preview

After build completes, download the APK and install on your Android device.

📌 Environment Variables

If your app uses environment configs (API keys or runtime URLs), add a .env file and update your code accordingly.

💬 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check issues page and send PRs.

📜 License

Appan Technology Pvt. Ltd.  © 2026
Address: Nagarain, Dhanusha, Nepal. 


---



