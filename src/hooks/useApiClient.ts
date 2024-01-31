import { useAppSelector } from "@/lib/hooks";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default () => {
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const apiClient = axios.create({
        baseURL: NEXT_PUBLIC_BACKEND_URL,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })
    return apiClient;
}