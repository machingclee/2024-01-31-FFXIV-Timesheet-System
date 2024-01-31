"use client";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function Home() {
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const router = useRouter();
    if (accessToken) {
        router.push("/timesheet")
    }

    return (
        null
    );
}
