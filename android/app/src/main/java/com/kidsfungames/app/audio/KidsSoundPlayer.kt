package com.kidsfungames.app.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.ToneGenerator
import android.media.AudioManager
import android.speech.tts.TextToSpeech
import java.util.Locale

class KidsSoundPlayer(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = TextToSpeech(context, this)
    private var toneGen: ToneGenerator? = null
    var isSoundEnabled: Boolean = true
    var isVoiceEnabled: Boolean = true

    init {
        try {
            toneGen = ToneGenerator(AudioManager.STREAM_MUSIC, 80)
        } catch (_: Exception) {
            // Audio setup fallback
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            tts?.setSpeechRate(0.85f) // Slower for kids
            tts?.setPitch(1.1f)      // Friendly pitch
        }
    }

    fun playPop() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_BEEP, 80)
        } catch (_: Exception) {}
    }

    fun playCorrectChime() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_ACK, 250)
        } catch (_: Exception) {}
    }

    fun playTryAgain() {
        if (!isSoundEnabled) return
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_NACK, 180)
        } catch (_: Exception) {}
    }

    fun speak(text: String) {
        if (!isVoiceEnabled) return
        try {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "KIDS_VOICE")
        } catch (_: Exception) {}
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
        toneGen?.release()
    }
}
