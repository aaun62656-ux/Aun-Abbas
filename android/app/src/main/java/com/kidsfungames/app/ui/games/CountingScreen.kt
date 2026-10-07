package com.kidsfungames.app.ui.games

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
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
fun CountingScreen(
    prefs: GamePreferences,
    soundPlayer: KidsSoundPlayer,
    onBack: () -> Unit
) {
    var targetCount by remember { mutableStateOf(4) }
    val tapped = remember { mutableStateListOf<Int>() }
    var showWinDialog by remember { mutableStateOf(false) }

    fun restart() {
        targetCount = (2..6).random()
        tapped.clear()
        showWinDialog = false
    }

    val options = remember(targetCount) {
        listOf(targetCount, targetCount - 1, targetCount + 1).shuffled()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Counting Game", fontWeight = FontWeight.Black) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { restart() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Restart")
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
            Text(
                "Tap each duck to count, then pick the answer!",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = TextDark,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Duck pond
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = SkyBlue.copy(alpha = 0.2f))
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(targetCount) { index ->
                            val isTapped = tapped.contains(index)
                            Surface(
                                modifier = Modifier
                                    .size(60.dp)
                                    .clickable {
                                        if (!isTapped) {
                                            tapped.add(index)
                                            soundPlayer.playPop()
                                            soundPlayer.speak("${tapped.size}")
                                        }
                                    },
                                shape = RoundedCornerShape(16.dp),
                                color = if (isTapped) SunnyYellow else Color.White
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text("🦆", fontSize = 32.sp)
                                    if (isTapped) {
                                        Text(
                                            "${tapped.indexOf(index) + 1}",
                                            fontWeight = FontWeight.Black,
                                            color = TextDark,
                                            fontSize = 18.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(32.dp))

            Text(
                "How many ducks are there?",
                fontWeight = FontWeight.Black,
                fontSize = 20.sp,
                color = TextDark
            )

            Spacer(Modifier.height(16.dp))

            // Number option bubbles
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                options.forEach { option ->
                    Button(
                        onClick = {
                            if (option == targetCount) {
                                soundPlayer.playCorrectChime()
                                soundPlayer.speak("Correct! $option ducks!")
                                prefs.addStarsToGame("counting", 3)
                                showWinDialog = true
                            } else {
                                soundPlayer.playTryAgain()
                                soundPlayer.speak("Try counting again!")
                            }
                        },
                        modifier = Modifier.size(80.dp),
                        shape = RoundedCornerShape(24.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CoralPink)
                    ) {
                        Text(
                            "$option",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                }
            }

            if (showWinDialog) {
                AlertDialog(
                    onDismissRequest = { restart() },
                    title = { Text("🎉 Super Counter!") },
                    text = { Text("You counted $targetCount ducks correctly! ⭐⭐⭐") },
                    confirmButton = {
                        Button(onClick = { restart() }) {
                            Text("Play Again")
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = onBack) {
                            Text("Home")
                        }
                    }
                )
            }
        }
    }
}
