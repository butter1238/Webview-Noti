import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import * as Notifications from "expo-notifications";
import { useState, useEffect } from "react";

// Configure notification handler for app-wide behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * HomeScreen Component
 * Main screen displaying WebView with embedded website and notification controls
 */
export default function HomeScreen() {
  const router = useRouter();
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);

  /**
   * Setup notification permissions and listeners on component mount
   */
  useEffect(() => {
    initializeNotifications();

    // Register notification response listener for tap events
    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    // Cleanup listener on component unmount
    return () => {
      notificationResponseSubscription.remove();
    };
  }, []);

  /**
   * Request notification permissions from user
   */
  const initializeNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please enable notifications in app settings to receive updates."
      );
    }
  };

  /**
   * Handle notification tap events and navigate accordingly
   */
  const handleNotificationResponse = (
    response: Notifications.NotificationResponse
  ) => {
    console.log("Notification tapped by user");

    const notificationData = response.notification.request.content.data;

    // Navigate to video player if notification contains video screen data
    if (notificationData?.screen === "video") {
      console.log("Navigating to video player screen");
      router.push("/video");
    }
  };

  /**
   * Schedule welcome notification with 3 second delay
   */
  const scheduleWelcomeNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 Welcome to the App",
          body: "Your app has loaded successfully!",
          data: { type: "welcome" },
        },
        trigger: { seconds: 3 },
      });

      Alert.alert(
        "Notification Scheduled",
        "Welcome notification will appear in 3 seconds"
      );
    } catch (error) {
      console.error("Error scheduling welcome notification:", error);
      Alert.alert("Error", "Failed to schedule notification");
    }
  };

  /**
   * Schedule video notification with 5 second delay and navigation capability
   */
  const scheduleVideoNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎬 Video Player Ready",
          body: "Tap this notification to watch the video!",
          data: { screen: "video", type: "video_ready" },
        },
        trigger: { seconds: 5 },
      });

      Alert.alert(
        "Notification Scheduled",
        "Video notification will appear in 5 seconds.\n\nTap the notification to open video player!"
      );
    } catch (error) {
      console.error("Error scheduling video notification:", error);
      Alert.alert("Error", "Failed to schedule notification");
    }
  };

  /**
   * Navigate directly to video player screen
   */
  const navigateToVideoPlayer = () => {
    console.log("Direct navigation to video player");
    router.push("/video");
  };

  /**
   * Handle WebView load completion
   */
  const handleWebViewLoad = () => {
    setIsWebViewLoading(false);
    console.log("WebView content loaded successfully");
  };

  /**
   * Handle WebView loading errors
   */
  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView loading error:", nativeEvent);
    Alert.alert(
      "Loading Error",
      "Failed to load website. Please check your internet connection."
    );
  };

  return (
    <View style={styles.container}>
      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: "https://www.google.com" }}
          style={styles.webView}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading website...</Text>
            </View>
          )}
        />
      </View>

      {/* Action Buttons Container */}
      <View style={styles.buttonContainer}>
        <Button
          title="🔔 Send Welcome Notification"
          onPress={scheduleWelcomeNotification}
          color="#4CAF50"
          accessibilityLabel="Schedule welcome notification with 3 second delay"
        />

        <Button
          title="🎬 Send Video Notification"
          onPress={scheduleVideoNotification}
          color="#FF9800"
          accessibilityLabel="Schedule video notification with 5 second delay"
        />

        <Button
          title="▶️ Open Video Player"
          onPress={navigateToVideoPlayer}
          color="#2196F3"
          accessibilityLabel="Navigate directly to video player"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
