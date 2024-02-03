"use client";

import MyButton from "@/component/MyButton";
import Spacer from "@/component/Spacer";
import boxShadow from "@/constants/boxShadow";
import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import authSlice from "@/redux/slices/authSlices";
import { Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default () => {
    const apiClient = useApiClient();
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const email = useAppSelector(s => s.auth.email);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const login = async () => {
        const res = await apiClient.get<{ url: string }>("/auth/login");
        const { url } = res.data;
        window.location.href = url;
    }

    const logout = async () => {
        dispatch(authSlice.actions.reset());
    }


    return (
        <div style={{ boxShadow: boxShadow.SHADOW_61 }}>
            <Container style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: 40
            }}>
                <div>
                    {accessToken && <MyButton variant="text" onClick={() => { router.push("/timesheet") }}>Timesheets</MyButton>}
                </div>
                <div>
                    {!accessToken && <Button variant="contained" onClick={login} >Login</Button>}
                    {accessToken && <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ fontSize: 12 }}>{email}</div>
                        <Spacer />
                        <MyButton onClick={logout}>Logout</MyButton>
                    </div>
                    }
                </div>
            </Container>
        </div>
    )
}