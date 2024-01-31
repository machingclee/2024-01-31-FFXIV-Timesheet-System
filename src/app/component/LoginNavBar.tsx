"use client";

import MyButton from "@/component/MyButton";
import Spacer from "@/component/Spacer";
import boxShadow from "@/constants/boxShadow";
import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import authSlice from "@/lib/slices/authSlices";
import { Button, Container } from "@mui/material";

export default () => {
    const apiClient = useApiClient();
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const email = useAppSelector(s => s.auth.email);
    const dispatch = useAppDispatch();

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
                justifyContent: "flex-end",
                alignItems: "center",
                height: 40
            }}>
                {!accessToken && <Button variant="contained" onClick={login} >Login</Button>}
                {accessToken && <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ fontSize: 12 }}>{email}</div>
                    <Spacer />
                    <MyButton onClick={logout}>Logout</MyButton>
                </div>
                }
            </Container>
        </div>
    )
}