import EmployeeModal from "@/components/modals/EmployeeModal";
import EditEmployeeModal from "@/components/modals/editModals/EmployeeModal";

export default async function EmployeesPage({ children, params }: { children: React.ReactNode, params: { id: string } }) {

  return (
    <>
      <EditEmployeeModal />
      <EmployeeModal params={params} />
      {children}
    </>
  );
}