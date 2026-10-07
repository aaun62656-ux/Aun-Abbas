package com.kidsfungames.app.data

import android.content.Context
import android.content.SharedPreferences

class GamePreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("kids_game_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_NUMBER_STARS = "stars_number"
        private const val KEY_ALPHABET_STARS = "stars_alphabet"
        private const val KEY_MEMORY_STARS = "stars_memory"
        private const val KEY_PUZZLE_STARS = "stars_puzzle"
        private const val KEY_COUNTING_STARS = "stars_counting"
        private const val KEY_SOUND_ENABLED = "sound_enabled"
        private const val KEY_VOICE_ENABLED = "voice_enabled"
        private const val KEY_SCREEN_LIMIT = "screen_limit_min"
    }

    var numberStars: Int
        get() = prefs.getInt(KEY_NUMBER_STARS, 0)
        set(value) = prefs.edit().putInt(KEY_NUMBER_STARS, value).apply()

    var alphabetStars: Int
        get() = prefs.getInt(KEY_ALPHABET_STARS, 0)
        set(value) = prefs.edit().putInt(KEY_ALPHABET_STARS, value).apply()

    var memoryStars: Int
        get() = prefs.getInt(KEY_MEMORY_STARS, 0)
        set(value) = prefs.edit().putInt(KEY_MEMORY_STARS, value).apply()

    var puzzleStars: Int
        get() = prefs.getInt(KEY_PUZZLE_STARS, 0)
        set(value) = prefs.edit().putInt(KEY_PUZZLE_STARS, value).apply()

    var countingStars: Int
        get() = prefs.getInt(KEY_COUNTING_STARS, 0)
        set(value) = prefs.edit().putInt(KEY_COUNTING_STARS, value).apply()

    var soundEnabled: Boolean
        get() = prefs.getBoolean(KEY_SOUND_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_SOUND_ENABLED, value).apply()

    var voiceEnabled: Boolean
        get() = prefs.getBoolean(KEY_VOICE_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_VOICE_ENABLED, value).apply()

    var screenLimitMinutes: Int
        get() = prefs.getInt(KEY_SCREEN_LIMIT, 0)
        set(value) = prefs.edit().putInt(KEY_SCREEN_LIMIT, value).apply()

    val totalStars: Int
        get() = numberStars + alphabetStars + memoryStars + puzzleStars + countingStars

    fun addStarsToGame(gameKey: String, count: Int) {
        when (gameKey) {
            "number" -> numberStars += count
            "alphabet" -> alphabetStars += count
            "memory" -> memoryStars += count
            "puzzle" -> puzzleStars += count
            "counting" -> countingStars += count
        }
    }

    fun resetAllProgress() {
        prefs.edit()
            .putInt(KEY_NUMBER_STARS, 0)
            .putInt(KEY_ALPHABET_STARS, 0)
            .putInt(KEY_MEMORY_STARS, 0)
            .putInt(KEY_PUZZLE_STARS, 0)
            .putInt(KEY_COUNTING_STARS, 0)
            .apply()
    }
}
