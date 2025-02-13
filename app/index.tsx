import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Home = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    // when signed in redirect user to home
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }

  // otherwise redirect user to welcome/signup
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
