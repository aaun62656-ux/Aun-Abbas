package com.kidsfungames.app.ui.games

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.VolumeUp
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

data class AlphabetLetter(val letter: Char, val word: String, val emoji: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlphabetLearningScreen(
    prefs: GamePreferences,
    soundPlayer: KidsSoundPlayer,
    onBack: () -> Unit
) {
    val alphabet = remember {
        listOf(
            AlphabetLetter('A', "Apple", "🍎"),
            AlphabetLetter('B', "Bear", "🐻"),
            AlphabetLetter('C', "Cat", "🐱"),
            AlphabetLetter('D', "Dog", "🐶"),
            AlphabetLetter('E', "Elephant", "🐘"),
            AlphabetLetter('F', "Fish", "🐟"),
            AlphabetLetter('G', "Giraffe", "🦒"),
            AlphabetLetter('H', "Hat", "🎩"),
            AlphabetLetter('I', "Ice Cream", "🍦"),
            AlphabetLetter('J', "Juice", "🧃"),
            AlphabetLetter('K', "Kite", "🪁"),
            AlphabetLetter('L', "Lion", "🦁"),
            AlphabetLetter('M', "Monkey", "🐵"),
            AlphabetLetter('N', "Nest", "🪺"),
            AlphabetLetter('O', "Orange", "🍊"),
            AlphabetLetter('P', "Penguin", "🐧"),
            AlphabetLetter('Q', "Queen", "👑"),
            AlphabetLetter('R', "Rocket", "🚀"),
            AlphabetLetter('S', "Sun", "☀️"),
            AlphabetLetter('T', "Turtle", "🐢"),
            AlphabetLetter('U', "Umbrella", "☂️"),
            AlphabetLetter('V', "Violin", "🎻"),
            AlphabetLetter('W', "Whale", "🐳"),
            AlphabetLetter('X', "Xylophone", "🎹"),
            AlphabetLetter('Y', "Yacht", "⛵"),
            AlphabetLetter('Z', "Zebra", "🦓")
        )
    }

    var selectedLetter by remember { mutableStateOf(alphabet[0]) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Alphabet Learning", fontWeight = FontWeight.Black) },
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
            // Selected Letter Spotlight Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .clickable {
                        soundPlayer.playPop()
                        soundPlayer.speak("${selectedLetter.letter}. ${selectedLetter.letter} is for ${selectedLetter.word}")
                    },
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = PlayfulGreen.copy(alpha = 0.2f))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "${selectedLetter.letter} ${selectedLetter.letter.lowercaseChar()}",
                            fontSize = 44.sp,
                            fontWeight = FontWeight.Black,
                            color = TextDark
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(selectedLetter.emoji, fontSize = 48.sp)
                        Text(selectedLetter.word, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }

                    Icon(
                        Icons.Default.VolumeUp,
                        contentDescription = "Speak",
                        tint = PlayfulGreen,
                        modifier = Modifier.size(36.dp)
                    )
                }
            }

            Spacer(Modifier.height(16.dp))

            // Grid of A to Z letters
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 64.dp),
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(alphabet) { item ->
                    val isCurrent = selectedLetter.letter == item.letter
                    Surface(
                        modifier = Modifier
                            .aspectRatio(1f)
                            .clickable {
                                selectedLetter = item
                                soundPlayer.playPop()
                                soundPlayer.speak("${item.letter}. ${item.word}")
                                prefs.addStarsToGame("alphabet", 1)
                            },
                        shape = RoundedCornerShape(16.dp),
                        color = if (isCurrent) SunnyYellow else Color.White,
                        border = androidx.compose.foundation.BorderStroke(
                            2.dp,
                            if (isCurrent) AmberStar else Color.LightGray.copy(alpha = 0.5f)
                        )
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text("${item.letter}", fontSize = 22.sp, fontWeight = FontWeight.Black)
                            Text(item.emoji, fontSize = 14.sp)
                        }
                    }
                }
            }
        }
    }
}
