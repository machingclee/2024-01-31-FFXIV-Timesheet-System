"use client";

import MyButton from "@/component/MyButton";
import MyLink from "@/component/MyLink";
import Spacer from "@/component/Spacer";
import GeneralPurposeDialog from "@/component/dialogs/GeneralPurposeDialog";
import boxShadow from "@/constants/boxShadow";
import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import authSlice, { AuthThunkAction } from "@/redux/slices/authSlices";
import { Button, Container, Fab } from "@mui/material";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { tss } from "tss-react";
import { FaRegMoon } from "react-icons/fa6";
import DarkModeButton from "./DarkModeButton";
import { FaGithub } from "react-icons/fa";

const useDialogStyles = tss.create(() => ({
    link: {
        "& button": {
            fontWeight: 400,
        },
        "&.selected": {
            "& button": {
                fontWeight: 600,
            },
        },
    },
    dialog: {
        paddingRight: 20,
        "& li": {
            marginBottom: 10
        }
    }
}))

export default () => {
    const apiClient = useApiClient();

    const pathname = usePathname();
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const email = useAppSelector(s => s.auth.email);
    const dispatch = useAppDispatch();
    const { cx, classes } = useDialogStyles();


    const login = async () => {
        const { url } = await dispatch(AuthThunkAction.googleLogin()).unwrap();
        window.location.href = url;
    }

    const logout = async () => {
        dispatch(authSlice.actions.reset());
    }

    const openAboutAuthor = () => {
        GeneralPurposeDialog.setContent({
            desc: () => {
                return (
                    <div style={{ fontSize: 16 }} className={cx(classes.dialog)}>
                        <ul>
                            <li>
                                Project Repository <a href="https://github.com/machingclee/2024-01-31-FFXIV-Timesheet-System" target="_blank">Github Page</a>.
                            </li>
                            <li>
                                Please feel free to contact me on <a href="machingclee@gmail.com">machingclee@gmail.com</a> for any new features
                            </li>
                            <li> Sometimes you may encounter 3~4s delay as it takes time to spin up the backend server if it has been a long while counted from the last request to the server.
                            </li >
                        </ul >
                    </div >
                )
            },
            yes: {
                text: "Ok"
            }
        })
        GeneralPurposeDialog.open();
    }


    return (
        <div style={{ boxShadow: boxShadow.SHADOW_61 }} className="navbar">
            <Container style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: 40
            }}>
                <div style={{ display: "flex" }}>
                    <MyLink href={"/timesheet"} className={cx(classes.link, pathname === "/timesheet" ? "selected" : "")}>
                        <MyButton variant="text" disabled={!accessToken} >Timesheets</MyButton>
                    </MyLink>
                    <Spacer />
                    <MyLink href={"/user-guide"} className={cx(classes.link, pathname === "/user-guide" ? "selected" : "")}>
                        <MyButton variant="text" >User Guide</MyButton>
                    </MyLink>

                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <MyButton variant="text" onClick={openAboutAuthor}>
                        <FaGithub size={24} />
                    </MyButton>
                    <Spacer width={30} />
                    {!accessToken && <Button variant="contained" onClick={login} >Login</Button>}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {accessToken && <>
                            <div style={{ fontSize: 12 }} className="email">{email}</div>
                            <Spacer />
                            <MyButton onClick={logout}>Logout</MyButton>
                        </>}
                        <Spacer />
                        <DarkModeButton />
                    </div>
                </div>
            </Container >
        </div >
    )
}