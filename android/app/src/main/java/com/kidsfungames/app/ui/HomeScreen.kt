package com.kidsfungames.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kidsfungames.app.data.GamePreferences
import com.kidsfungames.app.ui.theme.*

data class GameMenuItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val iconEmoji: String,
    val startColor: Color,
    val endColor: Color,
    val starsEarned: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    prefs: GamePreferences,
    onNavigateToGame: (String) -> Unit,
    onOpenParentGate: () -> Unit,
    onToggleSound: () -> Unit
) {
    val games = listOf(
        GameMenuItem("number_matching", "Number Matching", "Match numbers & groups!", "🔢", SkyBlue, Color(0xFF0288D1), prefs.numberStars),
        GameMenuItem("alphabet_learning", "Alphabet Learning", "Explore A to Z!", "🔤", PlayfulGreen, Color(0xFF388E3C), prefs.alphabetStars),
        GameMenuItem("memory_card", "Memory Cards", "Find animal pairs!", "🃏", PastelPurple, Color(0xFF7B1FA2), prefs.memoryStars),
        GameMenuItem("simple_puzzle", "Simple Puzzle", "Snap pieces together!", "🧩", SunnyYellow, Color(0xFFF57C00), prefs.puzzleStars),
        GameMenuItem("counting_game", "Counting Game", "Tap to count 1, 2, 3!", "⭐", CoralPink, Color(0xFFE64A19), prefs.countingStars)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🎈 ", fontSize = 24.sp)
                        Text("Kids Fun Games", fontWeight = FontWeight.Black, fontSize = 20.sp)
                    }
                },
                actions = {
                    // Total stars pill
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = SunnyYellow.copy(alpha = 0.3f),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = AmberStar, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("${prefs.totalStars}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }

                    // Sound Toggle
                    IconButton(onClick = onToggleSound) {
                        Icon(
                            if (prefs.soundEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                            contentDescription = "Sound"
                        )
                    }

                    // Parent Lock
                    IconButton(onClick = onOpenParentGate) {
                        Icon(Icons.Default.Lock, contentDescription = "Parents")
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            items(games) { game ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(28.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(game.iconEmoji, fontSize = 44.sp)
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color(0xFFFFF9C4)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Default.Star, contentDescription = null, tint = AmberStar, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(4.dp))
                                    Text("${game.starsEarned}", fontWeight = FontWeight.Black, fontSize = 12.sp)
                                }
                            }
                        }

                        Spacer(Modifier.height(8.dp))
                        Text(game.title, fontWeight = FontWeight.Black, fontSize = 22.sp, color = TextDark)
                        Text(game.subtitle, fontWeight = FontWeight.Medium, fontSize = 14.sp, color = TextSubtle)

                        Spacer(Modifier.height(16.dp))

                        // Large Play Button
                        Button(
                            onClick = { onNavigateToGame(game.id) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp),
                            shape = RoundedCornerShape(20.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = game.startColor)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Icon(Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(28.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("PLAY", fontWeight = FontWeight.Black, fontSize = 18.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
