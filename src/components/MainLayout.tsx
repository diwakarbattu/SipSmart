
import { Outlet } from "react-router";
import { ProfileDrawer } from "./ProfileDrawer";

export function MainLayout() {
    return (
        <>
            <Outlet />
            <ProfileDrawer />
        </>
    );
}
