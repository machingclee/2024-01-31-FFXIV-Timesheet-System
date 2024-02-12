import { RootState } from "@/redux/store";
import Cache from "@/util/Cache";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const getApiClient = () => {
    const state = Cache.store.getState() as RootState;
    const accessToken = state.auth.accessToken;
    const apiClient = axios.create({
        baseURL: NEXT_PUBLIC_BACKEND_URL,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })
    return apiClient;
}