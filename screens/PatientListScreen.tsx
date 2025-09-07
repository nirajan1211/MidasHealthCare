import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SkeletonLoader from "@/components/SkeletonLoader";
import {
  useDeletePatientMutation,
  useGetPatientListQuery,
} from "@/store/api/patientApi";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface User {
  userid: string;
  fname: string;
  mname?: string;
  lname: string;
  mobilenumber?: string;
  mobileno?: string;
  emailaddress?: string;
  email?: string;
  dobad?: string;
  dateofbirth?: string;
  gender?: string;
  bloodgroup?: string;
  address?: string;
  user_type?: string;
  relationid?: string;
  countrycode?: string;
  districtid?: string;
  vdcid?: string;
  wardno?: string;
  age?: string;
  agetype?: string;
}

const PatientListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data, error, isLoading, refetch } = useGetPatientListQuery();
  const [deletePatient] = useDeletePatientMutation();

  const handleDeleteUser = useCallback(
    (userId: string, userName: string) => {
      Alert.alert(
        "Delete Patient",
        `Are you sure you want to delete ${userName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deletePatient({ patientId: userId }).unwrap();
                Alert.alert("Success", "Patient deleted successfully");
              } catch (error) {
                console.error("Delete error:", error);
                Alert.alert("Error", "Failed to delete patient");
              }
            },
          },
        ]
      );
    },
    [deletePatient]
  );

  const getFullName = useCallback((user: User) => {
    const parts = [user?.fname, user?.mname, user?.lname].filter(
      (part) => part && String(part).trim()
    );
    return parts.join(" ") || "Unknown User";
  }, []);

  const getUserTypeLabel = useCallback((userType?: string) => {
    switch (userType?.toLowerCase()) {
      case "self":
        return "self";
      case "relative":
        return "relative";
      default:
        return "patient";
    }
  }, []);

  const handleEditPatient = useCallback(
    (patient: User) => {
      navigation.navigate("PatientForm", {
        patient: {
          ...patient,
          email: patient.email || patient.emailaddress,
          mobileno: patient.mobileno || patient.mobilenumber,
          dateofbirth: patient.dateofbirth || patient.dobad,
        },
        mode: "edit",
      });
    },
    [navigation]
  );

  const renderUser = useCallback(
    ({ item }: { item: User }) => {
      const fullName = getFullName(item);
      const userTypeLabel = getUserTypeLabel(item.user_type);

      return (
        <View className="bg-white mx-4 mb-2 rounded-lg shadow-sm">
          <View className="px-4 py-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">
                  {fullName}
                </Text>

                <View className="flex-row items-center mb-2">
                  <Text className="text-sm text-gray-600 mr-2">
                    {item.mobileno || item.mobilenumber || "No phone"}
                  </Text>
                  {item.gender && (
                    <View className="bg-gray-100 px-2 py-1 rounded">
                      <Text className="text-xs text-gray-600">
                        {item.gender}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="bg-teal-600 self-start px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-white">
                    {userTypeLabel}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3 ml-4">
                <TouchableOpacity
                  onPress={() => handleDeleteUser(item.userid, fullName)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons name="delete" size={24} color="#EF4444" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleEditPatient(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons name="edit" size={24} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [handleDeleteUser, getFullName, getUserTypeLabel, handleEditPatient]
  );

  const processedData = useMemo(() => {
    if (!data?.response) return [];

    let patients: User[] = [];

    if (data.response.list && Array.isArray(data.response.list)) {
      patients = data.response.list;
    } else if (data.response.my) {
      patients = [data.response.my];
    }

    return patients.filter(
      (patient, index, self) =>
        index === self.findIndex((p) => p.userid === patient.userid)
    );
  }, [data]);

  const renderHeader = useCallback(
    () => (
      <View className="px-4 py-3 bg-white">
        <Text className="text-orange-600 text-sm leading-5">
          Please select a patient for whom you want to take appointment for
        </Text>
      </View>
    ),
    []
  );

  const renderEmptyState = useCallback(
    () => (
      <View className="flex-1 justify-center items-center p-8">
        <MaterialIcons name="person-off" size={64} color="#9ca3af" />
        <Text className="text-gray-600 text-lg font-medium mt-4 mb-2 text-center">
          No Patients Found
        </Text>
        <Text className="text-gray-400 text-sm text-center mb-6">
          You haven't added any patients yet. Tap the "Add Patient" button to
          get started.
        </Text>
        <TouchableOpacity
          className="bg-teal-600 px-6 py-3 rounded-lg"
          onPress={() => navigation.navigate("PatientForm", { mode: "add" })}
        >
          <Text className="text-white font-semibold">Add First Patient</Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation]
  );

  const renderErrorState = useCallback(
    () => (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-red-500 text-lg font-semibold mb-2 text-center">
          Error loading patients
        </Text>
        <Text className="text-gray-600 text-sm text-center mb-4">
          {error && "data" in error
            ? `${error.status}: ${String(error.data)}`
            : "Network or parsing error occurred"}
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    ),
    [error, refetch]
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return renderErrorState();
  }

  if (processedData.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={processedData}
        renderItem={renderUser}
        keyExtractor={(item, index) =>
          item?.userid ? String(item.userid) : `patient-${index}`
        }
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#0D9488"]}
            tintColor="#0D9488"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
      />

      <View className="absolute bottom-6 right-6 flex-row items-center">
        <TouchableOpacity
          className="bg-teal-600 mr-3 px-4 py-3 rounded-lg shadow-md elevation-4"
          onPress={() => navigation.navigate("PatientForm", { mode: "add" })}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-sm">Add Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-teal-600 w-14 h-14 rounded-full justify-center items-center shadow-lg elevation-8"
          onPress={() => navigation.navigate("PatientForm", { mode: "add" })}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PatientListScreen;
