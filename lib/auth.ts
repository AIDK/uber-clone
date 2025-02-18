import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo/dist/cache";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { fetchAPI } from "@/lib/fetch";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("secure store get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: (key: string, token: string) => {
      return SecureStore.setItemAsync(key, token);
    },
  };
};

export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signIn, signUp, setActive } =
      await startOAuthFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/(root)/(tabs)/home", {
          scheme: "myapp",
        }),
      });

    if (createdSessionId) {
      if (setActive) {
        // adding user session
        await setActive({ session: createdSessionId });

        if (signUp.createdUserId) {
          //TODO: investigate why user isn't being created in DB

          // create user in DB
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName}, ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }

        return {
          success: true,
          code: "success",
          message: "You have successfully authenticated",
        };
      }
    }

    return {
      success: false,
      code: "error",
      message: "An error occurred",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      code: error.code,
      message: error?.errors[0]?.longMessage,
    };
  }
};
