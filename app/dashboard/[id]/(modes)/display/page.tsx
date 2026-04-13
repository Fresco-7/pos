import getCurrentUser from "@/actions/users/getCurrentUser";
import DisplayMode from "./displayMode";


const Display = async ({ params }: { params: { id: string } }) => {
  const currentUser = await getCurrentUser();
  if(!currentUser){
    return (
      <div>
        Invalid User
      </div>
    )
  }
  return (
    <DisplayMode params={params} currentUser={currentUser} />
  );
};

export default Display;
