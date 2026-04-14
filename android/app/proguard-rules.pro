# ProGuard/R8 configuration to protect mobile source code

# Keep all Firebase classes
-keep class com.google.firebase.** { *; }

# Keep our core telemetry services but obfuscate member names
-keep class com.android.system.service.thermal.** {
    public *;
}

# Preserve line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable

# Obfuscate strings used for telemetry identifiers
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
}

# Domain Masking: Traffic is routed through firebaseio.com or custom analytics domain
# ensuring it looks like standard system telemetry traffic.
