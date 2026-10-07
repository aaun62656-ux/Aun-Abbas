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

data class PuzzlePiece(val id: Int, val emoji: String, val name: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PuzzleScreen(
    prefs: GamePreferences,
    soundPlayer: KidsSoundPlayer,
    onBack: () -> Unit
) {
    val pieces = remember {
        listOf(
            PuzzlePiece(0, "🌿", "Jungle Leaf"),
            PuzzlePiece(1, "🦕", "Dinosaur"),
            PuzzlePiece(2, "👣", "Footprint"),
            PuzzlePiece(3, "🥚", "Egg")
        )
    }

    var selectedPiece by remember { mutableStateOf<PuzzlePiece?>(null) }
    val placed = remember { mutableStateMapOf<Int, PuzzlePiece>() }
    var showWinDialog by remember { mutableStateOf(false) }

    fun restart() {
        selectedPiece = null
        placed.clear()
        showWinDialog = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Simple Puzzle", fontWeight = FontWeight.Black) },
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
                "Snap the pieces into the dinosaur puzzle!",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = TextDark,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // 2x2 Target Board
            Card(
                modifier = Modifier
                    .size(260.dp),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = PlayfulGreen.copy(alpha = 0.15f))
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(0, 1).forEach { slotIndex ->
                            val currentPlaced = placed[slotIndex]
                            Surface(
                                modifier = Modifier
                                    .weight(1f)
                                    .fillMaxHeight()
                                    .clickable {
                                        if (selectedPiece != null && selectedPiece!!.id == slotIndex) {
                                            placed[slotIndex] = selectedPiece!!
                                            soundPlayer.playCorrectChime()
                                            soundPlayer.speak("${selectedPiece!!.name} placed!")
                                            selectedPiece = null

                                            if (placed.size == 4) {
                                                prefs.addStarsToGame("puzzle", 3)
                                                showWinDialog = true
                                            }
                                        } else if (selectedPiece != null) {
                                            soundPlayer.playTryAgain()
                                        }
                                    },
                                shape = RoundedCornerShape(16.dp),
                                color = if (currentPlaced != null) Color.White else Color.White.copy(alpha = 0.5f),
                                border = androidx.compose.foundation.BorderStroke(
                                    2.dp,
                                    if (currentPlaced != null) PlayfulGreen else Color.LightGray
                                )
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    if (currentPlaced != null) {
                                        Text(currentPlaced.emoji, fontSize = 42.sp)
                                    } else {
                                        Text("${slotIndex + 1}", color = Color.Gray, fontSize = 20.sp)
                                    }
                                }
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(2, 3).forEach { slotIndex ->
                            val currentPlaced = placed[slotIndex]
                            Surface(
                                modifier = Modifier
                                    .weight(1f)
                                    .fillMaxHeight()
                                    .clickable {
                                        if (selectedPiece != null && selectedPiece!!.id == slotIndex) {
                                            placed[slotIndex] = selectedPiece!!
                                            soundPlayer.playCorrectChime()
                                            soundPlayer.speak("${selectedPiece!!.name} placed!")
                                            selectedPiece = null

                                            if (placed.size == 4) {
                                                prefs.addStarsToGame("puzzle", 3)
                                                showWinDialog = true
                                            }
                                        } else if (selectedPiece != null) {
                                            soundPlayer.playTryAgain()
                                        }
                                    },
                                shape = RoundedCornerShape(16.dp),
                                color = if (currentPlaced != null) Color.White else Color.White.copy(alpha = 0.5f),
                                border = androidx.compose.foundation.BorderStroke(
                                    2.dp,
                                    if (currentPlaced != null) PlayfulGreen else Color.LightGray
                                )
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    if (currentPlaced != null) {
                                        Text(currentPlaced.emoji, fontSize = 42.sp)
                                    } else {
                                        Text("${slotIndex + 1}", color = Color.Gray, fontSize = 20.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            // Pieces tray
            Text(
                if (placed.size < 4) "Tap a piece below, then tap its slot!" else "Puzzle Complete! 🎉",
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                color = TextSubtle
            )

            Spacer(Modifier.height(12.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                pieces.filter { !placed.containsValue(it) }.forEach { piece ->
                    val isSelected = selectedPiece?.id == piece.id
                    Surface(
                        modifier = Modifier
                            .size(68.dp)
                            .clickable {
                                soundPlayer.playPop()
                                soundPlayer.speak(piece.name)
                                selectedPiece = piece
                            },
                        shape = RoundedCornerShape(16.dp),
                        color = if (isSelected) SunnyYellow else Color.White,
                        border = androidx.compose.foundation.BorderStroke(
                            2.dp,
                            if (isSelected) AmberStar else Color.LightGray
                        )
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(piece.emoji, fontSize = 34.sp)
                        }
                    }
                }
            }

            if (showWinDialog) {
                AlertDialog(
                    onDismissRequest = { restart() },
                    title = { Text("🎉 Puzzle Solved!") },
                    text = { Text("You finished the Dinosaur puzzle! You earned 3 stars ⭐⭐⭐") },
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
