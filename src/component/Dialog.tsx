"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { tss } from 'tss-react';
import { TEXT_COLOR, TEXT_DARK_COLOR } from './Body';
import useDialogStyle from '@/app/style/useMenuStyle';
import { useAppSelector } from '@/redux/hooks';
import boxShadow from '@/constants/boxShadow';
import FadeIn from './FadeIn';
import { DialogContent } from '@mui/material';

type DialogSetStateContent = {
    title?: string,
    width?: number
    desc: () => JSX.Element,
    no?: {
        text?: string,
        action?: () => void
    },
    yes?: {
        text?: string,
        action?: () => void
    },
    upperRightButton?: () => JSX.Element
}


const defaultDialogState = {
    desc: () => <></>,
    title: "",
    no: { text: "", action: () => { } },
    yes: { text: "", action: () => { } },
};

export default class MyDialog {
    public open = () => console.log("not initialized")
    public close = () => console.log("not initialized")
    public setContent: (content: DialogSetStateContent) => void = () => { console.log("not initialized") }


    public render = () => {
        const darkMode = useAppSelector(s => s.auth.darkMode);
        const [open, setOpen] = React.useState(false);
        const [content, setContent] = React.useState<DialogSetStateContent>(defaultDialogState)
        const { classes, cx } = useStyles({ darkMode, width: content.width });
        this.open = () => { setOpen(true) };
        this.close = () => { setOpen(false) };
        this.setContent = setContent;
        const { desc: Desc_, no, title, yes, upperRightButton } = content
        const UpperRight = upperRightButton || (() => <></>);
        const Desc = () => (
            <FadeIn dependencies={[open]}>
                <Desc_ />
            </FadeIn>
        );
        const theme = useTheme();
        const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

        const handleClose = () => {
            setOpen(false);
            // setContent(defaultDialogState);
        };

        return (
            <React.Fragment >
                <Dialog
                    className={cx(classes.customDialog)}
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" style={{
                        fontWeight: 600,
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            {title}
                        </div>
                        <div>
                            {<UpperRight />}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Desc />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {no?.text && <Button autoFocus onClick={() => {
                            no?.action?.();
                            handleClose()
                        }}>
                            {no.text}
                        </Button>}
                        {yes?.text && <Button onClick={() => {
                            yes?.action?.();
                            handleClose()
                        }} autoFocus>
                            {yes.text}
                        </Button>}
                    </DialogActions>
                </Dialog>
            </React.Fragment >
        );
    }
}

const useStyles = tss.withParams<{ darkMode: boolean, width?: number | string }>().create(({ darkMode, width }) => ({
    customDialog: {
        "& button.MuiButton-root": {
            textTransform: "capitalize"
        },
        "& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded": {
            "& p, & div, & li, & h2, & h3, & h4, & h5, & h6": {
                color: darkMode ? `${TEXT_COLOR}` : `${TEXT_DARK_COLOR}`
            },
            "& a": {
                color: darkMode ? `${TEXT_COLOR} !important` : `${TEXT_DARK_COLOR} !important`,
                backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                textDecoration: "none",
                padding: "2px 10px",
                borderRadius: 4
            },
            boxShadow: darkMode ? `${boxShadow.SHADOW_53} !important` : `${boxShadow.SHADOW_62} !important`,
            backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgb(255,255,255)",
            backdropFilter: "blur(100px)"
        },
        "& button": {
            color: darkMode ? `${TEXT_COLOR} !important` : `${TEXT_DARK_COLOR} !important`
        },
        "& textarea": {
            fontSize: "18px !important",
        },
        "& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation24.MuiDialog-paper.MuiDialog-paperScrollPaper": {
            minWidth: width || 620,
            width: width || 620
        }
    }
}))