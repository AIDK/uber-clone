import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import InputField from "@/components/InputField";

const Profile = () => {
  const { user } = useUser();
  return (
    <SafeAreaView className={"flex-1"}>
      <ScrollView
        className={"px-5"}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text className={"text-2xl font-JakartaBold my-3"}>My profile</Text>

        {/*Profile Image*/}
        <View className={"flex items-center justify-center my-5"}>
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className={
              "rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
            }
          />
        </View>

        <View
          className={
            "flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 p-5 my-5"
          }
        >
          <View className={"flex flex-col items-start justify-start w-full"}>
            {/*First Name*/}
            <InputField
              label={"First name"}
              placeholder={user?.firstName || "Not Found"}
              placeholderTextColor={"gray"}
              containerStyle={"w-full"}
              inputStyle={"p-3.5"}
              editable={false}
            />

            {/*Last Name*/}
            <InputField
              label={"Last name"}
              placeholder={user?.lastName || "Not Found"}
              placeholderTextColor={"gray"}
              containerStyle={"w-full"}
              inputStyle={"p-3.5"}
              editable={false}
            />

            {/*Email*/}
            <InputField
              label={"Email"}
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              placeholderTextColor={"gray"}
              containerStyle={"w-full"}
              inputStyle={"p-3.5"}
              editable={false}
            />

            {/*Telephone*/}
            <InputField
              label={"Phone"}
              placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              placeholderTextColor={"gray"}
              containerStyle={"w-full"}
              inputStyle={"p-3.5"}
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
