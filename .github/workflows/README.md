# GitHub Actions Workflows

This directory contains GitHub Actions workflows for building, testing, and publishing the Vlive app.

## Workflows

### 1. CI (`ci.yml`)
**Triggers:** Push/PR to main/master branches

**Jobs:**
- TypeScript type checking
- Test builds (web export)
- Creates preview artifacts

### 2. Build and Release (`build-and-release.yml`)
**Triggers:**
- Push to main/master
- Tags starting with `v` (e.g., `v1.0.0`)
- Manual workflow dispatch

**Jobs:**
1. **Validate:** TypeScript checks and Metro bundling test
2. **Build Android:** Builds APK using EAS or local Gradle
3. **Build Web:** Exports web bundle
4. **Release:** Creates GitHub Release with APK and web assets
5. **Deploy Web:** Deploys web build to GitHub Pages

## Required Secrets

### `EXPO_TOKEN` (Required for EAS builds)
1. Go to [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)
2. Create a new access token
3. Copy the token
4. Go to your GitHub repository → Settings → Secrets and variables → Actions
5. Click "New repository secret"
6. Name: `EXPO_TOKEN`
7. Value: Paste your Expo token

### `GITHUB_TOKEN` (Auto-provided)
This is automatically provided by GitHub Actions. No setup needed.

## How to Use

### Automatic Release on Tag Push
```bash
# Create a new tag
git tag v1.0.0

# Push the tag
git push origin v1.0.0
```

The workflow will automatically:
1. Build the Android APK
2. Export the web bundle
3. Create a GitHub Release with both artifacts

### Manual Build
1. Go to GitHub repository → Actions
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. Choose build type:
   - `development` - Development client build
   - `preview` - Preview APK (internal distribution)
   - `production` - Production release build

### View Live Web Demo
The web version is automatically deployed to GitHub Pages at:
`https://yourusername.github.io/Vlive`

## Build Outputs

| Platform | Location | Download |
|----------|----------|----------|
| Android | GitHub Release Assets | `.apk` file |
| Web | GitHub Pages + Release Assets | `dist/` folder |

## Troubleshooting

### EAS Build Fails
- Check that `EXPO_TOKEN` is set correctly
- Verify your `eas.json` configuration
- Check Expo dashboard for build logs

### Android Build Fails
- Ensure `android/` directory exists (run `npx expo prebuild`)
- Check Java version compatibility

### TypeScript Errors
- Run `npx tsc --noEmit` locally to check errors
- Fix all type errors before pushing

## Configuration Files

- `eas.json` - EAS build profiles
- `app.json` - Expo app configuration
- `package.json` - Dependencies and scripts