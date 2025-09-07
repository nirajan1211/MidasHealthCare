import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const SkeletonItem = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [opacity]);

  return (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Animated.View
            style={{ opacity }}
            className="h-5 bg-gray-200 rounded mb-2 w-3/4"
          />
          <Animated.View
            style={{ opacity }}
            className="h-4 bg-gray-200 rounded mb-1 w-1/2"
          />
          <Animated.View
            style={{ opacity }}
            className="h-4 bg-gray-200 rounded w-2/3"
          />
        </View>

        <View className="flex-row space-x-2">
          <Animated.View
            style={{ opacity }}
            className="w-8 h-8 bg-gray-200 rounded-full"
          />
          <Animated.View
            style={{ opacity }}
            className="w-8 h-8 bg-gray-200 rounded-full"
          />
        </View>
      </View>
    </View>
  );
};

const SkeletonLoader = () => {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Animated.View className="h-8 bg-gray-200 rounded w-1/2" />
        <Animated.View className="h-10 bg-gray-200 rounded w-20" />
      </View>

      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};

export default SkeletonLoader;
