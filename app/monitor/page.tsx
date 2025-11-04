import AdminMonitorPage from "@/components/Monitor";
import RequireRole from "@/components/RequireRole";

export default function ItemCreate(){
    return(
        <RequireRole allowedRoles={["ADMIN"]}>
            <AdminMonitorPage/>
        </RequireRole>
    )
}