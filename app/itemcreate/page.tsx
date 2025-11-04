import AddItemPage from "@/components/ItemCreate";
import RequireRole from "@/components/RequireRole";

export default function ItemCreate(){
    return(
        <RequireRole allowedRoles={["ADMIN"]}>
            <AddItemPage/>
        </RequireRole>
    )
}