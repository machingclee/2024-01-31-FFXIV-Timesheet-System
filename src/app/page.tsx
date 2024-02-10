"use client";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const router = useRouter();
    if (accessToken) {
        router.push("/timesheet")
    }
    useEffect(() => {
        router.push("/timesheet")
    }, [])

    return (
        null
    );
}
