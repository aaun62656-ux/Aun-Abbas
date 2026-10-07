package com.kidsfungames.app.ui.games

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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

data class MatchItem(val number: Int, val emoji: String, val name: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NumberMatchingScreen(
    prefs: GamePreferences,
    soundPlayer: KidsSoundPlayer,
    onBack: () -> Unit
) {
    val items = remember {
        listOf(
            MatchItem(1, "🐶", "Puppy"),
            MatchItem(2, "🍎", "Apples"),
            MatchItem(3, "🚗", "Cars"),
            MatchItem(4, "⭐", "Stars")
        )
    }

    var selectedNumber by remember { mutableStateOf<Int?>(null) }
    var selectedItemNumber by remember { mutableStateOf<Int?>(null) }
    val matched = remember { mutableStateListOf<Int>() }
    var showWinDialog by remember { mutableStateOf(false) }

    fun restart() {
        selectedNumber = null
        selectedItemNumber = null
        matched.clear()
        showWinDialog = false
    }

    fun checkMatch(num: Int, itemNum: Int) {
        if (num == itemNum) {
            matched.add(num)
            soundPlayer.playCorrectChime()
            soundPlayer.speak("Great! That is $num!")
            selectedNumber = null
            selectedItemNumber = null
            if (matched.size == items.size) {
                prefs.addStarsToGame("number", 3)
                showWinDialog = true
            }
        } else {
            soundPlayer.playTryAgain()
            soundPlayer.speak("Try again!")
            selectedNumber = null
            selectedItemNumber = null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Number Matching", fontWeight = FontWeight.Black) },
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
                "Match the number to the group!",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = TextDark,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Numbers column
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items.forEach { item ->
                        val isMatched = matched.contains(item.number)
                        val isSelected = selectedNumber == item.number

                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .clickable(enabled = !isMatched) {
                                    soundPlayer.playPop()
                                    soundPlayer.speak("${item.number}")
                                    if (selectedItemNumber != null) {
                                        checkMatch(item.number, selectedItemNumber!!)
                                    } else {
                                        selectedNumber = item.number
                                    }
                                },
                            shape = RoundedCornerShape(20.dp),
                            color = when {
                                isMatched -> PlayfulGreen.copy(alpha = 0.3f)
                                isSelected -> SunnyYellow
                                else -> Color.White
                            },
                            border = androidx.compose.foundation.BorderStroke(
                                3.dp,
                                if (isSelected) AmberStar else SkyBlue.copy(alpha = 0.5f)
                            )
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    "${item.number}",
                                    fontSize = 36.sp,
                                    fontWeight = FontWeight.Black,
                                    color = TextDark
                                )
                            }
                        }
                    }
                }

                // Emoji groups column
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items.shuffled(remember { java.util.Random(42) }).forEach { item ->
                        val isMatched = matched.contains(item.number)
                        val isSelected = selectedItemNumber == item.number

                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .clickable(enabled = !isMatched) {
                                    soundPlayer.playPop()
                                    soundPlayer.speak("${item.number} ${item.name}")
                                    if (selectedNumber != null) {
                                        checkMatch(selectedNumber!!, item.number)
                                    } else {
                                        selectedItemNumber = item.number
                                    }
                                },
                            shape = RoundedCornerShape(20.dp),
                            color = when {
                                isMatched -> PlayfulGreen.copy(alpha = 0.3f)
                                isSelected -> SunnyYellow
                                else -> Color.White
                            },
                            border = androidx.compose.foundation.BorderStroke(
                                3.dp,
                                if (isSelected) AmberStar else SkyBlue.copy(alpha = 0.5f)
                            )
                        ) {
                            Row(
                                modifier = Modifier.fillMaxSize(),
                                horizontalArrangement = Arrangement.Center,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                repeat(item.number) {
                                    Text(item.emoji, fontSize = 24.sp)
                                }
                            }
                        }
                    }
                }
            }

            if (showWinDialog) {
                AlertDialog(
                    onDismissRequest = { restart() },
                    title = { Text("🎉 Super Job!") },
                    text = { Text("You matched all the numbers! You earned 3 stars ⭐⭐⭐") },
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
