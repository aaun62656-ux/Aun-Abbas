package com.kidsfungames.app.ui.games

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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

data class CardItem(val id: Int, val pairId: String, val emoji: String, val name: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemoryCardScreen(
    prefs: GamePreferences,
    soundPlayer: KidsSoundPlayer,
    onBack: () -> Unit
) {
    val animalCards = remember {
        listOf(
            "puppy" to Pair("🐶", "Puppy"),
            "kitty" to Pair("🐱", "Kitty"),
            "bunny" to Pair("🐰", "Bunny")
        )
    }

    var cards by remember {
        mutableStateOf(
            animalCards.flatMapIndexed { idx, pair ->
                listOf(
                    CardItem(idx * 2, pair.first, pair.second.first, pair.second.second),
                    CardItem(idx * 2 + 1, pair.first, pair.second.first, pair.second.second)
                )
            }.shuffled()
        )
    }

    val flipped = remember { mutableStateListOf<Int>() }
    val matched = remember { mutableStateListOf<String>() }
    var showWinDialog by remember { mutableStateOf(false) }

    fun restart() {
        cards = cards.shuffled()
        flipped.clear()
        matched.clear()
        showWinDialog = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Memory Card Game", fontWeight = FontWeight.Black) },
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
                "Find matching animal pairs!",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = TextDark,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(cards) { card ->
                    val isFlipped = flipped.contains(card.id)
                    val isMatched = matched.contains(card.pairId)
                    val showFace = isFlipped || isMatched

                    Surface(
                        modifier = Modifier
                            .aspectRatio(0.85f)
                            .clickable(enabled = !showFace && flipped.size < 2) {
                                soundPlayer.playPop()
                                flipped.add(card.id)

                                if (flipped.size == 2) {
                                    val firstCard = cards.find { it.id == flipped[0] }
                                    val secondCard = cards.find { it.id == flipped[1] }

                                    if (firstCard != null && secondCard != null && firstCard.pairId == secondCard.pairId) {
                                        matched.add(firstCard.pairId)
                                        flipped.clear()
                                        soundPlayer.playCorrectChime()
                                        soundPlayer.speak("You found ${firstCard.name}!")

                                        if (matched.size == animalCards.size) {
                                            prefs.addStarsToGame("memory", 3)
                                            showWinDialog = true
                                        }
                                    } else {
                                        soundPlayer.playTryAgain()
                                    }
                                } else if (flipped.size > 2) {
                                    flipped.clear()
                                }
                            },
                        shape = RoundedCornerShape(20.dp),
                        color = when {
                            isMatched -> PlayfulGreen.copy(alpha = 0.3f)
                            showFace -> Color.White
                            else -> PastelPurple
                        },
                        border = androidx.compose.foundation.BorderStroke(
                            3.dp,
                            if (showFace) PastelPurple.copy(alpha = 0.5f) else Color.White
                        )
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            if (showFace) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(card.emoji, fontSize = 38.sp)
                                    Text(card.name, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            } else {
                                Text("⭐", fontSize = 32.sp)
                            }
                        }
                    }
                }
            }

            if (showWinDialog) {
                AlertDialog(
                    onDismissRequest = { restart() },
                    title = { Text("🎉 Great Memory!") },
                    text = { Text("You matched all the animals! You earned 3 stars ⭐⭐⭐") },
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
