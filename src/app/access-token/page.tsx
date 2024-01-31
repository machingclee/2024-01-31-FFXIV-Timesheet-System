"use client";

import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import authSlice from "@/lib/slices/authSlices";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default () => {
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    const searchParams = useSearchParams();
    const token = useAppSelector(s => s.auth.accessToken);
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token") || "";
        dispatch(authSlice.actions.setToken(token));
        apiClient.get<{ success: boolean, result: { email: string } }>(`/auth/authenticate?token=${token}`).then(res => {
            const { success, result } = res.data;
            if (success) {
                dispatch(authSlice.actions.setEmail(result.email));
                router.push("/")
            }

        });
    }, [])

    return null
}