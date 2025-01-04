import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUSerData } from "../services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter(); // Ensure router is correctly imported

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("session user: ", session?.user?.id);

        if (session) {
          setAuth(session?.user);
          updateUserData(session?.user, session?.user?.email);
          router.replace("/home");
        } else {
          setAuth(null);
          router.replace("/welcome");
        }
      }
    );

    // Cleanup subscription on component unmount
  }, []);

  const updateUserData = async (user, email) => {
    let res = await getUSerData(user?.id);
    if (res.success) setUserData({ ...res.data, email });
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
