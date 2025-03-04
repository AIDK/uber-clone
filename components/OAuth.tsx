﻿import { Text, View, Image } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { googleOAuth } from "@/lib/auth";
import { router } from "expo-router";

const OAuth = () => {
  //TODO: replace deprecated useOAuth
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startOAuthFlow);

      // if the current session already exists or the user has
      // successfully authenticated (signed in) we can redirect to the home screen
      if (result.code === "session_exists" || result.code === "success") {
        router.push("/(root)/(tabs)/home");
      }
    } catch (err: any) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View>
      <View
        className={"flex flex-row justify-center items-center mt-4 gap-x-3"}
      >
        <View className={"flex-1 h-[1px] bg-general-100"} />
        <Text className={"text-lg"}>Or</Text>
        <View className={"flex-1 h-[1px] bg-general-100"} />
      </View>
      <CustomButton
        title={"Log in with Google"}
        className={"mt-5 w-full shadow-none"}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode={"contain"}
            className={"w-5 h-5 mx-2"}
          />
        )}
        bgVariant={"outline"}
        textVariant={"primary"}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
