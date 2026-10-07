# Kids Fun Games - Native Android (Jetpack Compose) Application

A colorful, child-friendly, safe educational games application for Android phones and tablets, built using modern **Kotlin** and **Jetpack Compose**.

## Features & Games Included
1. **Number Matching Game**: Interactive number-to-set matching with audio pronunciation and positive reinforcement.
2. **Alphabet Learning Game**: Phonics exploration (A to Z) with illustrations and interactive Quiz challenge.
3. **Memory Card Game**: Tactile card flips featuring adorable animal companions with star rating rewards.
4. **Simple Puzzle Game**: 2x2 snap jigsaw puzzles designed for young children and toddlers with zero frustration.
5. **Counting Game**: Interactive item tapping with melodic audio counting notes and multiple-choice bubble selection.
6. **Parental Zone**: Protected by a math gate; includes audio controls, screen time limits, and progress management.
7. **COPPA / Child Safety Compliant**: Zero advertisements, zero analytics/tracking, zero third-party web links, completely offline.

## Project Structure
```
android/
├── build.gradle.kts           # Root Gradle build configuration
├── settings.gradle.kts        # Module inclusions and repositories
├── gradle.properties          # JVM memory and AndroidX properties
└── app/
    ├── build.gradle.kts       # Dependencies, Compose compiler, and release signing config
    ├── proguard-rules.pro     # Code obfuscation and size shrinking rules
    └── src/main/
        ├── AndroidManifest.xml # Privacy-safe minimal manifest
        ├── java/com/kidsfungames/app/
        │   ├── MainActivity.kt
        │   ├── audio/KidsSoundPlayer.kt
        │   ├── data/GamePreferences.kt
        │   └── ui/
        │       ├── HomeScreen.kt
        │       ├── theme/ (Color.kt, Theme.kt)
        │       ├── games/ (NumberMatchingScreen.kt, AlphabetLearningScreen.kt, MemoryCardScreen.kt, PuzzleScreen.kt, CountingScreen.kt)
        │       └── parent/ParentZoneScreen.kt
        └── res/values/ (strings.xml, colors.xml, themes.xml)
```

## How to Build Signed Android App Bundle (AAB) for Google Play

### 1. Open in Android Studio
- Open Android Studio (Ladybug / Iguana or later).
- Select **Open** and choose the `android/` directory.
- Allow Gradle sync to complete.

### 2. Generate Release Keystore (if you don't already have one)
Run in terminal:
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias kidsgame
```

### 3. Build Signed AAB
Run from the `android/` directory:
```bash
./gradlew bundleRelease
```
The resulting signed AAB will be located at:
`android/app/build/outputs/bundle/release/app-release.aab`

You can upload this bundle directly to the **Google Play Console** under Production or Closed Testing track!
