package com.kidsfungames.app.ui.parent

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kidsfungames.app.audio.KidsSoundPlayer
import com.kidsfungames.app.data.GamePreferences
import com.kidsfungames.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ParentZoneScreen(
    prefs: GamePreferences,
    soundPlayer: KidsSoundPlayer,
    onBack: () -> Unit
) {
    var isUnlocked by remember { mutableStateOf(false) }
    val num1 by remember { mutableStateOf((6..12).random()) }
    val num2 by remember { mutableStateOf((5..9).random()) }
    var inputAnswer by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Parent Zone", fontWeight = FontWeight.Black) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (!isUnlocked) {
                // Parent Math Gate
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = SkyBlue, modifier = Modifier.size(48.dp))
                        Spacer(Modifier.height(8.dp))
                        Text("Grown-Ups Verification", fontWeight = FontWeight.Black, fontSize = 20.sp)
                        Text("Solve to access parental settings:", fontSize = 14.sp, color = TextSubtle)

                        Spacer(Modifier.height(16.dp))
                        Text("$num1 + $num2 = ?", fontWeight = FontWeight.Black, fontSize = 28.sp)

                        Spacer(Modifier.height(16.dp))
                        OutlinedTextField(
                            value = inputAnswer,
                            onValueChange = { inputAnswer = it; showError = false },
                            label = { Text("Enter answer") },
                            singleLine = true
                        )

                        if (showError) {
                            Text("Incorrect answer. Please try again.", color = Color.Red, fontSize = 12.sp)
                        }

                        Spacer(Modifier.height(16.dp))
                        Button(
                            onClick = {
                                if (inputAnswer.trim() == "${num1 + num2}") {
                                    isUnlocked = true
                                    soundPlayer.playCorrectChime()
                                } else {
                                    showError = true
                                    soundPlayer.playTryAgain()
                                }
                            },
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Text("Unlock Parent Zone", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            } else {
                // Unlocked Parent Controls
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Shield, contentDescription = null, tint = PlayfulGreen)
                            Spacer(Modifier.width(8.dp))
                            Text("Child Safety & COPPA Assured", fontWeight = FontWeight.Black, fontSize = 16.sp)
                        }
                        Text(
                            "Kids Fun Games has zero ads, collects zero personal info, and works 100% offline.",
                            fontSize = 12.sp,
                            color = TextSubtle,
                            modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
                        )

                        HorizontalDivider()
                        Spacer(Modifier.height(12.dp))

                        // Audio Settings
                        Text("Audio Controls", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Sound Effects", fontSize = 14.sp)
                            Switch(
                                checked = prefs.soundEnabled,
                                onCheckedChange = {
                                    prefs.soundEnabled = it
                                    soundPlayer.isSoundEnabled = it
                                }
                            )
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Voice Pronunciation", fontSize = 14.sp)
                            Switch(
                                checked = prefs.voiceEnabled,
                                onCheckedChange = {
                                    prefs.voiceEnabled = it
                                    soundPlayer.isVoiceEnabled = it
                                }
                            )
                        }

                        Spacer(Modifier.height(12.dp))
                        HorizontalDivider()
                        Spacer(Modifier.height(12.dp))

                        // Total Progress
                        Text("Total Progress", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = AmberStar)
                            Spacer(Modifier.width(4.dp))
                            Text("${prefs.totalStars} Stars Earned Across Games", fontSize = 14.sp)
                        }

                        Spacer(Modifier.height(16.dp))
                        OutlinedButton(
                            onClick = {
                                prefs.resetAllProgress()
                                soundPlayer.playPop()
                            },
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Red),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Reset All Progress")
                        }
                    }
                }
            }
        }
    }
}
