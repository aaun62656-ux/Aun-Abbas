package com.kidsfungames.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.kidsfungames.app.audio.KidsSoundPlayer
import com.kidsfungames.app.data.GamePreferences
import com.kidsfungames.app.ui.HomeScreen
import com.kidsfungames.app.ui.games.*
import com.kidsfungames.app.ui.parent.ParentZoneScreen
import com.kidsfungames.app.ui.theme.KidsFunGamesTheme

class MainActivity : ComponentActivity() {
    private lateinit var soundPlayer: KidsSoundPlayer
    private lateinit var preferences: GamePreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        preferences = GamePreferences(this)
        soundPlayer = KidsSoundPlayer(this).apply {
            isSoundEnabled = preferences.soundEnabled
            isVoiceEnabled = preferences.voiceEnabled
        }

        setContent {
            KidsFunGamesTheme {
                val navController = rememberNavController()

                Surface(modifier = Modifier.fillMaxSize()) {
                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") {
                            HomeScreen(
                                prefs = preferences,
                                onNavigateToGame = { route ->
                                    soundPlayer.playPop()
                                    navController.navigate(route)
                                },
                                onOpenParentGate = {
                                    soundPlayer.playPop()
                                    navController.navigate("parent_zone")
                                },
                                onToggleSound = {
                                    val newState = !preferences.soundEnabled
                                    preferences.soundEnabled = newState
                                    soundPlayer.isSoundEnabled = newState
                                }
                            )
                        }

                        composable("number_matching") {
                            NumberMatchingScreen(
                                prefs = preferences,
                                soundPlayer = soundPlayer,
                                onBack = { navController.popBackStack() }
                            )
                        }

                        composable("alphabet_learning") {
                            AlphabetLearningScreen(
                                prefs = preferences,
                                soundPlayer = soundPlayer,
                                onBack = { navController.popBackStack() }
                            )
                        }

                        composable("memory_card") {
                            MemoryCardScreen(
                                prefs = preferences,
                                soundPlayer = soundPlayer,
                                onBack = { navController.popBackStack() }
                            )
                        }

                        composable("simple_puzzle") {
                            PuzzleScreen(
                                prefs = preferences,
                                soundPlayer = soundPlayer,
                                onBack = { navController.popBackStack() }
                            )
                        }

                        composable("counting_game") {
                            CountingScreen(
                                prefs = preferences,
                                soundPlayer = soundPlayer,
                                onBack = { navController.popBackStack() }
                            )
                        }

                        composable("parent_zone") {
                            ParentZoneScreen(
                                prefs = preferences,
                                soundPlayer = soundPlayer,
                                onBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        soundPlayer.release()
    }
}
