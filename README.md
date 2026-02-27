# Vlive

A React Native/Expo application for live streaming channels.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📦 Building & Publishing

This project uses GitHub Actions for automated building and publishing.

### Automated Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| **CI** | Push/PR to main | Type checks and test builds |
| **Build & Release** | Tag push or manual | Creates APK and GitHub Release |
| **Deploy Web** | Push to main | Deploys to GitHub Pages |

### Creating a Release

1. **Push a version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will automatically:**
   - Build Android APK
   - Export web bundle
   - Create GitHub Release with artifacts

3. **Download the APK** from the Releases page

### Manual Build

1. Go to [Actions tab](../../actions)
2. Select "Build and Release"
3. Click "Run workflow"
4. Choose build type (development/preview/production)

## 🔧 Setup Required Secrets

To enable EAS builds, add your Expo token:

1. Get token: [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)
2. Go to Repo → Settings → Secrets → Actions
3. Add `EXPO_TOKEN` with your token

## 📱 Download Latest Build

- **Android APK:** [Releases](../../releases/latest)
- **Web Demo:** [GitHub Pages](https://nightsky171203.github.io/Vlive)

## 🛠️ Tech Stack

- React Native 0.79
- Expo 53
- TypeScript
- React Navigation
- AsyncStorage

## 📁 Project Structure

```
├── components/     # React components
├── utils/          # Utility functions
├── Types/          # TypeScript definitions
├── assets/         # Images and static files
└── .github/workflows/  # CI/CD workflows