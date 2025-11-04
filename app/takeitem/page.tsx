import TakeItemPage from "@/components/ItemTaken";
import RequireRole from "@/components/RequireRole";

export default function ItemCreate(){
    return(
        <RequireRole allowedRoles={["USER"]}>
            <TakeItemPage/>
        </RequireRole>
    )
}