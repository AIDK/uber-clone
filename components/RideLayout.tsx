import { Text, View, Image, TouchableOpacity, Platform } from "react-native";
import React, { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { icons } from "@/constants";
import Map from "@/components/Map";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const RideLayout = ({
  title,
  children,
  snapPoints,
}: {
  title: string;
  children: React.ReactNode;
  snapPoints?: string[];
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView>
      <View className={"flex-1 bg-white"}>
        <View className={"flex flex-col h-screen bg-blue-500"}>
          <View
            className={
              "flex flex-row absolute z-10 top-16 items-center justify-start px-5"
            }
          >
            {/* back button */}
            <TouchableOpacity onPress={() => router.back()}>
              <View
                className={
                  "w-10 h-10 rounded-full bg-white items-center justify-center"
                }
              >
                <Image
                  source={icons.backArrow}
                  resizeMode={"contain"}
                  className={"w-5 h-5"}
                />
              </View>
            </TouchableOpacity>
            <Text className={"text-xl font-JakartaSemiBold ml-5"}>
              {title || ""}
            </Text>
          </View>

          {/* back button */}
          <Map />
        </View>

        {/* sliding tray (from bottom up) */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={1}
        >
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
