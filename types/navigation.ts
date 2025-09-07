export type RootStackParamList = {
  PatientList: undefined;
  PatientForm: { patient?: any; mode?: "add" | "edit" } | undefined;
  AddPatient: undefined;
  EditPatient: { patient: any };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
