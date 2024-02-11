"use client";
import Image from 'next/image'
import addEventGif from "../../../assets/images/create-an-event.gif";
import makeSelectionGif from "../../../assets/images/make-selection.gif"
import hightLightsGif from "../../../assets/images/add-user-highlight.gif";
import addCommentGif from "../../../assets/images/messaging.gif";
import Spacer from '@/component/Spacer';
import { PropsWithChildren, useState } from 'react';
import { Collapse } from '@mui/material';
import MyButton from '@/component/MyButton';
import { tss } from 'tss-react';
import colors from '@/constants/colors';
import FadeIn from '@/component/FadeIn';
import boxShadow from '@/constants/boxShadow';
import Head from "next/head";

const gifs = [
    addEventGif,
    makeSelectionGif,
    hightLightsGif,
    addCommentGif
]



const useStyles = tss.create(() => ({
    active: {
        "&.MuiButtonBase-root.MuiButton-root.MuiButton-contained": {
            backgroundColor: "rgb(25, 118, 210)",
            color: "white"
        }
    },

    unordered: {
        "& ul": {
            listStyleType: "none"
        },
        "& .MuiButtonBase-root.MuiButton-root.MuiButton-contained": {
            width: 200,
            color: "rgba(0,0,0,0.75)",
            marginRight: 15,
            backgroundColor: "transparent",
            padding: 10,
            "& b": {
                fontWeight: 500,
                fontSize: 15
            }
        },
        "& .MuiCollapse-wrapperInner": {
            marginTop: 20,
            borderLeft: `10px solid rgb(224, 224, 224)`,
            paddingLeft: 20,
            marginBottom: 20
        },
        "& img": {
            height: "auto"
        },
        "& li": {
            marginBottom: 10,
        }
    }
}))

const returnIndex = (idx: number) => (i: number) => {
    return idx
}

export default () => {
    const [expandIndex, setExpandIndex] = useState(0);
    const { classes, cx } = useStyles();
    const show0 = expandIndex === 0;
    const show1 = expandIndex === 1;
    const show2 = expandIndex === 2;
    const show3 = expandIndex === 3;

    return <>
        <div style={{ height: 0 }}>
            {gifs.map((gif) => <Image style={{ height: 0 }} src={gif} alt="Fill timeslots" />)}
        </div>
        <div className={cx(classes.unordered)}>

            <h2 style={{ color: colors.BLUE }}>Usage</h2>

            <div style={{ display: "flex" }} className="user-guide-tag">
                <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(returnIndex(0))} className={cx(show0 ? classes.active : "unselected")}>
                    <b>1. Create an event to get timetables for 1 week in a row</b>
                </MyButton>

                <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(returnIndex(1))} className={cx(show1 ? classes.active : "unselected")}>
                    <b>2. Add users and fill the timeslots OR</b>
                </MyButton>

                <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(returnIndex(2))} className={cx(show2 ? classes.active : "unselected")}>
                    <b>3. Share it to members and let them fill the available timeslots</b>
                </MyButton>

                <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(returnIndex(3))} className={cx(show3 ? classes.active : "unselected")}>
                    <b>4. Add comments for potential delay</b>
                </MyButton>
            </div>
            <Spacer />

            <div
                style={{ boxShadow: boxShadow.SHADOW_58, padding: 5, borderRadius: 10, opacity: 0.95 }}
                className="user-guide-container"
            >
                {show0 && <FadeIn>
                    <div>
                        <Image src={addEventGif} alt="Create an event" />
                    </div>
                </FadeIn>}
                {show1 && <FadeIn>
                    <div>
                        <Image src={makeSelectionGif} alt="Fill timeslots" />
                    </div>
                </FadeIn>}


                {show2 && <FadeIn>
                    <div>
                        <Image src={hightLightsGif} alt="Fill timeslots" />
                    </div>
                </FadeIn>}



                {show3 && <FadeIn>
                    <div>
                        <Image src={addCommentGif} alt="Fill timeslots" />
                    </div>
                </FadeIn>}
            </div>
            <Spacer height={60} />
        </div>
    </>
}