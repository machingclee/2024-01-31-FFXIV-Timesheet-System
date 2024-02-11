"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { tss } from 'tss-react';

type DialogContent = {
    title?: string,
    desc: () => JSX.Element,
    no?: {
        text?: string,
        action?: () => void
    },
    yes?: {
        text?: string,
        action?: () => void
    }
}


export default class MyDialog {
    public open = () => console.log("not initialized")
    public close = () => console.log("not initialized")
    public setContent: (content: DialogContent) => void = () => { console.log("not initialized") }


    public render = () => {
        const { classes, cx } = useStyles();
        const [open, setOpen] = React.useState(false);
        const [content, setContent] = React.useState<DialogContent>({
            desc: () => <></>,
            title: "",
            no: { text: "", action: () => { } },
            yes: { text: "", action: () => { } },
        })
        this.open = () => { setOpen(true) };
        this.close = () => { setOpen(false) };
        this.setContent = setContent;
        const { desc: Desc, no, title, yes } = content


        const theme = useTheme();
        const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
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
                    <DialogTitle id="responsive-dialog-title">
                        {title}
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
            </React.Fragment>
        );
    }
}

const useStyles = tss.create(() => ({
    customDialog: {
        "& textarea": {
            fontSize: "18px !important",
        },
        "& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation24.MuiDialog-paper.MuiDialog-paperScrollPaper": {
            minWidth: "460px"
        }
    }
}))