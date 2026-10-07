package com.kidsfungames.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val KidsColorScheme = lightColorScheme(
    primary = SkyBlue,
    secondary = SunnyYellow,
    tertiary = PlayfulGreen,
    background = BackgroundWarm,
    surface = CardSurface,
    onPrimary = Color.White,
    onSecondary = TextDark,
    onBackground = TextDark,
    onSurface = TextDark
)

@Composable
fun KidsFunGamesTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = KidsColorScheme,
        content = content
    )
}
