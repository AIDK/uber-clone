import { ScrollView, Text, View, Image } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { Alert } from "react-native";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "", // code user enters
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        //TODO: create new user in DB

        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "verification failed",
          state: "failed",
        });
      }
    } catch (err: any) {
      // capture the failure to our verification state
      setVerification({
        ...verification,
        error: err.error[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className={"flex-1 bg-white"}>
      <View className={"flex-1 bg-white"}>
        <View className={"relative w-full h-[250px]"}>
          <Image source={images.signUpCar} className={"z-0 w-full h-[250px]"} />
          <Text
            className={
              "text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5"
            }
          >
            Create Your Account
          </Text>
        </View>
        <View className={"p-5"}>
          {/*NOTE: placeholderTextColor is required on IOS to show placeholder text*/}
          <InputField
            label="Name"
            placeholder="Enter your name"
            placeholderTextColor={"gray"}
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            placeholderTextColor={"gray"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            placeholderTextColor={"gray"}
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          {/* sign up button */}
          <CustomButton
            title={"Sign Up"}
            onPress={onSignUpPress}
            className={"mt-6"}
          />

          {/* OAuth (Log in with Google) */}
          <OAuth />

          {/* Sign In*/}
          <Link
            href={"/sign-in"}
            className={"text-lg text-center text-general-200 mt-10"}
          >
            <Text>Already have an account? </Text>
            <Text className={"text-primary-500"}>Log In</Text>
          </Link>
        </View>

        {/* verification modal (Pending) */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
            <Text className={"text-2xl font-JakartaBold mb-2"}>
              Verification
            </Text>
            <Text className={"font-JakartaBold mb-2"}>
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholderTextColor={"gray"}
              placeholder={"12345"}
              value={verification.code}
              keyboardType={"numeric"}
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />

            {/* display any verification errors*/}
            {verification.error && (
              <Text className={"text-red-500 text-sm mt-1"}>
                {verification.error}
              </Text>
            )}

            {/* submit code */}
            <CustomButton
              title={"Verify Email"}
              onPress={onVerifyPress}
              className={"mt-5 bg-success-500"}
            />
          </View>
        </ReactNativeModal>

        {/* verification modal (Success) */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className={"bg-white px-7 py-9 rounded-2xl min-h-[300px]"}>
            <Image
              source={images.check}
              className={"w-[110px] h-[110px] mx-auto my-5"}
            />
            <Text className={"text-3xl font-JakartaSemiBold text-center "}>
              Verified
            </Text>
            <Text
              className={
                "text-base text-gray-400 font-Jakarta text-center mt-2"
              }
            >
              You have successfully verified your account.
            </Text>
            <CustomButton
              title={"Browse Home"}
              onPress={() => {
                // hide modal on success and redirect to Home
                setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home");
              }}
              className={"mt-5"}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
