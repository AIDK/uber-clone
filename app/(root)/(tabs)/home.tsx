import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { useEffect, useState } from "react";
import "react-native-get-random-values";
import { router } from "expo-router";
import { useFetch } from "@/lib/fetch";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermissions, setHasPermissions] = useState(false);
  const { data: recentRides, loading } = useFetch(`/(api)/ride/${user?.id}`);

  const handleSignOut = () => {
    signOut().then(() => {
      console.log(`${user?.id} signed out of the app.`);
    });

    router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // set the destination location to store
    setDestinationLocation(location);

    // navigate to next screen
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async () => {
      //NOTE: prompt user for permission to access location while the app is in the foreground
      const { status } = await Location.requestForegroundPermissionsAsync();

      // permission was not granted (exit)
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }

      //NOTE: permission was granted so we gather all relevant information
      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      // set the user location to the global store
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };

    requestLocation();
  }, []);

  return (
    <SafeAreaView className={"bg-general-500"}>
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className={"px-5"} // left and right padding of 20px
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          paddingBottom: 80, // leaves gap at bottom of list
        }}
        // displays when list is empty (no data)
        ListEmptyComponent={() => (
          <View className={"flex flex-col items-center justify-center"}>
            {!loading ? (
              // display image when list is empty
              <>
                <Image
                  source={images.noResult}
                  className={"w-40 h-40"}
                  alt={"No recent rides found"}
                  resizeMode={"contain"}
                />
                <Text className={"text-sm text-gray-400"}>
                  No recent rides found
                </Text>
              </>
            ) : (
              // loading indicator (spinner)
              <ActivityIndicator
                className={"pt-5"}
                size={"small"}
                color={"#000"}
              />
            )}
          </View>
        )}
        // render text at the top of the list (allows for logout)
        ListHeaderComponent={() => (
          <>
            <View className={"flex flex-row items-center justify-between my-5"}>
              {/* welcome text (can display the user's name or email */}
              <Text className={"text-xl font-JakartaExtraBold capitalize"}>
                Welcome{", "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
                👋
              </Text>

              {/* logout button */}
              <TouchableOpacity
                onPress={handleSignOut}
                className={
                  "justify-center items-center w-10 h-10 rounded-full bg-white"
                }
              >
                <Image source={icons.out} className={"w-4 h-4"} />
              </TouchableOpacity>
            </View>

            {/* Google text input */}
            <GoogleTextInput
              icon={icons.search}
              containerStyle={"bg-white shadow-md shadow-neutral-300"}
              handlePress={handleDestinationPress}
            />

            <>
              <Text className={"text-xl font-JakartaBold mt-5 mb-3"}>
                Your Current Location
              </Text>
              <View
                className={
                  "flex flex-row items-center bg-transparent h-[300px]"
                }
              >
                {/* Current Location (Maps) */}
                <Map />
              </View>
            </>

            {/* Recent rides */}
            <Text className={"text-xl font-JakartaBold mt-5 mb-3"}>
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}
