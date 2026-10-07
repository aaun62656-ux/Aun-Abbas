import React, { useState } from 'react';
import { 
  ArrowLeft, Volume2, VolumeX, Mic, MicOff, Clock, 
  RotateCcw, ShieldCheck, Star, Award, Code2, 
  Check, Copy, Terminal, Smartphone 
} from 'lucide-react';
import { AppSettings, GameStats } from '../types';
import { playSound } from '../utils/audio';

interface ParentDashboardProps {
  stats: GameStats;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  stats,
  settings,
  onUpdateSettings,
  onResetProgress,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'stats' | 'android_project'>('settings');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalStars = 
    stats.numberMatchingStars + 
    stats.alphabetLearningStars + 
    stats.memoryCardStars + 
    stats.simplePuzzleStars + 
    stats.countingGameStars;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const gradleSnippet = `// android/app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.kidsfungames.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.kidsfungames.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            // Fill with your release keystore configuration for Google Play
            storeFile = file("my-release-key.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "kidsgame123"
            keyAlias = "kidsgame"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "kidsgame123"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }
    buildFeatures {
        compose = true
    }
}`;

  const manifestSnippet = `<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Zero invasive permissions needed for child safety -->
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Kids Fun Games"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.KidsFunGames">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="user"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.KidsFunGames">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            playSound.pop(settings.soundEnabled);
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>

        <div className="flex items-center gap-2 text-indigo-900">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black">Parent & Family Zone</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Controls & Audio
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'stats'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Learning Progress ({totalStars} ⭐)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('android_project')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'android_project'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android AAB Setup</span>
        </button>
      </div>

      {/* Tab: Controls & Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Audio & Speech Controls */}
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Sound & Audio Effects</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2.5">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-gray-800">Game Sound Effects</div>
                    <div className="text-[11px] text-gray-500">Chimes, victory cheers & pops</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      ...settings,
                      soundEnabled: !settings.soundEnabled,
                    });
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    settings.soundEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2.5">
                  {settings.speechEnabled ? (
                    <Mic className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <MicOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-gray-800">Voice Pronunciation</div>
                    <div className="text-[11px] text-gray-500">Reads numbers & alphabet letters</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({
                      ...settings,
                      speechEnabled: !settings.speechEnabled,
                    });
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    settings.speechEnabled
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {settings.speechEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Screen Time Limit */}
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Healthy Screen Time Limit</span>
            </h2>
            <p className="text-xs text-gray-500">
              When enabled, a gentle friendly reminder will pop up suggesting playtime is over for now.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Unlimited', val: 0 },
                { label: '15 Minutes', val: 15 },
                { label: '30 Minutes', val: 30 },
                { label: '45 Minutes', val: 45 },
                { label: '60 Minutes', val: 60 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    playSound.pop(settings.soundEnabled);
                    onUpdateSettings({
                      ...settings,
                      screenTimeLimitMinutes: opt.val,
                    });
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                    settings.screenTimeLimitMinutes === opt.val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Child Safety Assurance */}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-900">Child Safe & COPPA Compliant</div>
                <p className="text-[12px] text-emerald-800 leading-relaxed">
                  Kids Fun Games contains zero advertisements, zero in-app purchases, no external web links accessible to kids, and collects no personal data whatsoever. All progress is safely stored locally on this device.
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900">Reset Game Progress</div>
                <div className="text-[11px] text-gray-500">Clears all stars and earned scores</div>
              </div>
              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  Reset Progress
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Learning Progress & Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* High-level score banner */}
          <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 text-white rounded-3xl shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Total Achievements</span>
              <div className="text-3xl font-black flex items-center gap-2 mt-0.5">
                <span>{totalStars}</span>
                <Star className="w-8 h-8 fill-yellow-200 text-yellow-200" />
              </div>
              <p className="text-xs text-amber-100 mt-1">
                Completed {stats.totalGamesPlayed} learning rounds
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Award className="w-10 h-10 text-yellow-100" />
            </div>
          </div>

          {/* Breakdown per game */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Number Matching', stars: stats.numberMatchingStars, color: 'text-sky-600', icon: '🔢' },
              { title: 'Alphabet Learning', stars: stats.alphabetLearningStars, color: 'text-emerald-600', icon: '🔤' },
              { title: 'Memory Cards', stars: stats.memoryCardStars, color: 'text-purple-600', icon: '🃏' },
              { title: 'Simple Puzzle', stars: stats.simplePuzzleStars, color: 'text-amber-600', icon: '🧩' },
              { title: 'Counting Game', stars: stats.countingGameStars, color: 'text-rose-600', icon: '⭐' },
            ].map((game) => (
              <div key={game.title} className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{game.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{game.title}</div>
                    <div className="text-[11px] text-gray-500">Learner Activity</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-200">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-black text-amber-900">{game.stars}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Android Project & Google Play AAB Export */}
      {activeTab === 'android_project' && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>Android Build & Signed AAB Preparation</span>
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              This repository contains the complete native Kotlin & Jetpack Compose project located in the <code className="text-indigo-600 font-mono font-semibold">/android</code> directory. It is pre-configured for modern Gradle, Compose UI, and signed Google Play App Bundle (AAB) builds.
            </p>

            <div className="p-3 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs space-y-2 overflow-x-auto">
              <div className="text-gray-400"># 1. Generate release keystore:</div>
              <div className="text-emerald-400">keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias kidsgame</div>
              <div className="text-gray-400 mt-2"># 2. Build production Signed Android App Bundle (AAB):</div>
              <div className="text-emerald-400">./gradlew bundleRelease</div>
              <div className="text-gray-400 mt-2"># 3. Output AAB path for Google Play Console:</div>
              <div className="text-yellow-300">android/app/build/outputs/bundle/release/app-release.aab</div>
            </div>
          </div>

          {/* Android Code Previews */}
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>app/build.gradle.kts (AAB & Release Config)</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopy('gradle', gradleSnippet)}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {copiedCode === 'gradle' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'gradle' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-950 text-gray-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48">
              {gradleSnippet}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>AndroidManifest.xml (Kids Safe & Minimal Permissions)</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopy('manifest', manifestSnippet)}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {copiedCode === 'manifest' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'manifest' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-950 text-gray-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48">
              {manifestSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
