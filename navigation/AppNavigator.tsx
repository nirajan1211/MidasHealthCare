import { RootStackParamList } from "@/types/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import PatientForm from "@/screens/PatientForm";
import PatientListScreen from "@/screens/PatientListScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PatientList"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2563eb",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="PatientList"
          component={PatientListScreen}
          options={{
            title: "Patient List",
            headerStyle: {
              backgroundColor: "#2563eb",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "#fff",
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="PatientForm"
          component={PatientForm}
          options={{
            title: "Add Family Member",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
