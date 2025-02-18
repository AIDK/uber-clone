import { Image, Text, FlatList, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { Ride } from "@/types/type";

const Rides = () => {
  const { user } = useUser();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`,
  );
  return (
    <SafeAreaView>
      <FlatList
        data={recentRides}
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
              <ActivityIndicator
                className={"pt-5"}
                size={"small"}
                color={"#000"}
              />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <Text className={"text-2xl font-JakartaBold my-5"}>All Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;
