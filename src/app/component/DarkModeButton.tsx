"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import authSlice from "@/redux/slices/authSlices";
import { Button } from "@mui/material";
import { FaRegMoon } from "react-icons/fa6";
import { LuSun } from "react-icons/lu";

export default () => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const dispatch = useAppDispatch();
    const toggle = () => {
        dispatch(authSlice.actions.setDarkMode(!darkMode));
    }
    return (
        <div
            style={{
                borderRadius: "50%",
                width: 30,
                height: 30,
                padding: 0,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            {darkMode && <FaRegMoon size={20} />}
            {!darkMode && <LuSun size={20} />}
            <Button
                className="darkmode-button"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                onClick={toggle}
            />
        </div>
    )
}   
