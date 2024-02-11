"use client";

import MyButton from "@/component/MyButton";
import Spacer from "@/component/Spacer";
import WarningDialog from "@/component/dialogs/WarningDialog";
import boxShadow from "@/constants/boxShadow";
import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import authSlice from "@/redux/slices/authSlices";
import { Button, Container } from "@mui/material";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { tss } from "tss-react";


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
        const res = await apiClient.get<{ url: string }>("/auth/login");
        const { url } = res.data;
        window.location.href = url;
    }

    const logout = async () => {
        dispatch(authSlice.actions.reset());
    }

    const openAboutAuthor = () => {
        WarningDialog.setContent({
            desc: () => {
                return (
                    <div style={{ fontSize: 16 }} className={cx(classes.dialog)}>
                        <ul>
                            <li>
                                Author's Repo: <a href="https://github.com/machingclee?tab=repositories">Github Page</a>.
                            </li>
                            <li>This timesheet-page is created for non-commercial purpose.</li>
                            <li>
                                Please feel free to contact me, James, on <a href="machingclee@gmail.com">machingclee@gmail.com</a> to request/suggest for any new features.
                            </li>

                            <li>
                                The website is deployed in a minimal possible cost to the best of my knowledge.
                            </li>
                            <li> Sometimes you may encounter 3~4s delay as it takes time to spin up the backend server if it has been a long time from the last request to the server (i.e., staying idle to cut cost).
                            </li >
                        </ul >
                    </div >
                )
            },
            yes: {
                text: "Ok"
            }
        })
        WarningDialog.open();
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
                    <Link href={"/timesheet"} className={cx(classes.link, pathname === "/timesheet" ? "selected" : "")}>
                        <MyButton variant="text" disabled={!accessToken} >Timesheets</MyButton>
                    </Link>
                    <Spacer />
                    <Link href={"/user-guide"} className={cx(classes.link, pathname === "/user-guide" ? "selected" : "")}>
                        <MyButton variant="text" >User Guide</MyButton>
                    </Link>

                </div>
                <div style={{ display: "flex" }}>
                    <MyButton variant="text" onClick={openAboutAuthor} >About Author</MyButton>
                    <Spacer width={30} />
                    {!accessToken && <Button variant="contained" onClick={login} >Login</Button>}
                    {accessToken && <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ fontSize: 12 }}>{email}</div>
                        <Spacer />
                        <MyButton onClick={logout}>Logout</MyButton>
                    </div>
                    }
                </div>
            </Container >
        </div >
    )
}