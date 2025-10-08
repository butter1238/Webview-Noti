// import { View, Text, Button, StyleSheet } from "react-native";
// import { Video, ResizeMode } from "expo-av";
// import { useRouter } from "expo-router";
// import { useRef, useState } from "react";

// export default function VideoScreen() {
//   const router = useRouter();
//   const video = useRef(null);
//   const [playing, setPlaying] = useState(false);

//   const toggle = async () => {
//     if (playing) {
//       await video.current?.pauseAsync();
//     } else {
//       await video.current?.playAsync();
//     }
//     setPlaying(!playing);
//   };

//   return (
//     <View style={styles.container}>
//       <Video
//         ref={video}
//         source={{ uri: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }}
//         style={styles.video}
//         resizeMode={ResizeMode.CONTAIN}
//         shouldPlay={false}
//       />

//       <View style={styles.controls}>
//         <Button title={playing ? "⏸️ Pause" : "▶️ Play"} onPress={toggle} />
//         <Button title="🔙 Back" onPress={() => router.back()} color="#666" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   video: { width: "100%", height: 300 },
//   controls: { padding: 20, gap: 10 },
// });

// second code implement

import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import Slider from "@react-native-community/slider";

export default function VideoScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Format time (milliseconds to MM:SS)
  const formatTime = (millis?: number) => {
    if (!millis) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Play/Pause Toggle
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Mute/Unmute
  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Seek Backward (-10 seconds)
  const seekBackward = async () => {
    if (videoRef.current && status?.positionMillis !== undefined) {
      const wasPlaying = status.isPlaying;
      const newPosition = Math.max(0, status.positionMillis - 10000);

      await videoRef.current.setPositionAsync(newPosition, {
        toleranceMillisBefore: 0,
        toleranceMillisAfter: 0,
      });

      if (wasPlaying) {
        await videoRef.current.playAsync();
      }
    }
  };

  // Seek Forward (+10 seconds)
  const seekForward = async () => {
    if (
      videoRef.current &&
      status?.positionMillis !== undefined &&
      status?.durationMillis
    ) {
      const wasPlaying = status.isPlaying;
      const newPosition = Math.min(
        status.durationMillis,
        status.positionMillis + 10000
      );

      await videoRef.current.setPositionAsync(newPosition, {
        toleranceMillisBefore: 0,
        toleranceMillisAfter: 0,
      });

      if (wasPlaying) {
        await videoRef.current.playAsync();
      }
    }
  };

  // Slider change (manual seek)
  const onSliderChange = async (value: number) => {
    if (videoRef.current && status?.durationMillis) {
      const wasPlaying = status.isPlaying;
      const newPosition = value * status.durationMillis;

      await videoRef.current.setPositionAsync(newPosition, {
        toleranceMillisBefore: 0,
        toleranceMillisAfter: 0,
      });

      if (wasPlaying) {
        await videoRef.current.playAsync();
      }
    }
  };

  // Fullscreen
  const goFullscreen = async () => {
    if (videoRef.current) {
      await videoRef.current.presentFullscreenPlayer();
    }
  };

  // Update status
  const onPlaybackStatusUpdate = (newStatus: AVPlaybackStatus) => {
    if (newStatus.isLoaded) {
      setStatus(newStatus);
      setIsPlaying(newStatus.isPlaying);
    }
  };

  // Calculate progress (0 to 1)
  const progress = status?.durationMillis
    ? status.positionMillis / status.durationMillis
    : 0;

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        useNativeControls={false}
        progressUpdateIntervalMillis={100}
      />

      {/* Time Display */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(status?.positionMillis)} /{" "}
          {formatTime(status?.durationMillis)}
        </Text>
        <Text style={styles.statusText}>
          {status?.isLoaded
            ? isPlaying
              ? "▶️ Playing"
              : "⏸️ Paused"
            : "⏳ Loading..."}
        </Text>
      </View>

      {/* Seek Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onSlidingComplete={onSliderChange}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#666"
          thumbTintColor="#2196F3"
        />
      </View>

      {/* Main Controls */}
      <View style={styles.mainControls}>
        {/* Seek Backward */}
        <Pressable
          style={({ pressed }) => [styles.seekBtn, pressed && styles.pressed]}
          onPress={seekBackward}
        >
          <Text style={styles.seekText}>⏪</Text>
          <Text style={styles.seekLabel}>-10s</Text>
        </Pressable>

        {/* Play/Pause */}
        <Pressable
          style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
          onPress={togglePlayPause}
        >
          <Text style={styles.playText}>{isPlaying ? "⏸️" : "▶️"}</Text>
        </Pressable>

        {/* Seek Forward */}
        <Pressable
          style={({ pressed }) => [styles.seekBtn, pressed && styles.pressed]}
          onPress={seekForward}
        >
          <Text style={styles.seekText}>⏩</Text>
          <Text style={styles.seekLabel}>+10s</Text>
        </Pressable>
      </View>

      {/* Additional Controls */}
      <View style={styles.additionalControls}>
        {/* Mute */}
        <Pressable
          style={({ pressed }) => [
            styles.controlBtn,
            styles.muteBtn,
            pressed && styles.pressed,
          ]}
          onPress={toggleMute}
        >
          <Text style={styles.controlIcon}>{isMuted ? "🔇" : "🔊"}</Text>
          <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
        </Pressable>

        {/* Fullscreen */}
        <Pressable
          style={({ pressed }) => [
            styles.controlBtn,
            styles.fullscreenBtn,
            pressed && styles.pressed,
          ]}
          onPress={goFullscreen}
        >
          <Text style={styles.controlIcon}>⛶</Text>
          <Text style={styles.controlText}>Fullscreen</Text>
        </Pressable>

        {/* Back */}
        <Pressable
          style={({ pressed }) => [
            styles.controlBtn,
            styles.backBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.controlIcon}>🔙</Text>
          <Text style={styles.controlText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: 280,
    backgroundColor: "#000",
  },
  timeContainer: {
    padding: 16,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  timeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusText: {
    color: "#999",
    fontSize: 14,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1a1a1a",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  mainControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#1a1a1a",
    gap: 20,
  },
  seekBtn: {
    backgroundColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 70,
  },
  seekText: {
    fontSize: 28,
    marginBottom: 4,
  },
  seekLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  playBtn: {
    backgroundColor: "#2196F3",
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: "center",
    alignItems: "center",
  },
  playText: {
    fontSize: 38,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#1a1a1a",
    gap: 12,
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  muteBtn: {
    backgroundColor: "#FF5722",
  },
  fullscreenBtn: {
    backgroundColor: "#4CAF50",
  },
  backBtn: {
    backgroundColor: "#666",
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
