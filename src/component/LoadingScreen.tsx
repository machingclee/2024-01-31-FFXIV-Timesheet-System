"use client";

import { useAppSelector } from "@/redux/hooks"
import { BeatLoader } from "react-spinners"

export default () => {
    const loading = useAppSelector(s => s.app.loading);
    if (!loading) {
        return null;
    }
    return <div style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.8)",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000000
    }}>
        <BeatLoader color="#36d7b7" style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% - 50px)",
            transform: "translate(-50%,-50%)"
        }} />
    </div>
}