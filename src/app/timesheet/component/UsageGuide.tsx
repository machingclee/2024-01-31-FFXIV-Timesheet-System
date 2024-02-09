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

const useStyles = tss.create(() => ({
    unordered: {
        "& li": {
            marginBottom: 10
        }
    }
}))

export default () => {
    const [expandIndex, setExpandIndex] = useState(0);
    const { classes, cx } = useStyles();

    return <div className={cx(classes.unordered)}>
        <ul>
            <li>
                <div>
                    <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(0)}>
                        <b>Create an event.</b>
                    </MyButton>
                </div>
                <Collapse in={expandIndex === 0}>
                    <Spacer />
                    <Spacer />
                    <div>
                        <Image src={addEventGif} alt="Create an event" />
                    </div>
                    <Spacer />
                    <Spacer />
                    <Spacer />
                </Collapse>
            </li>

            <li>
                <div>
                    <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(1)}>
                        <b>Share a timesheet to members and fill in the available timeslots.</b>
                    </MyButton>
                </div>
                <Collapse in={expandIndex === 1}>
                    <Spacer />
                    <Spacer />
                    <div>
                        <Image src={makeSelectionGif} alt="Fill timeslots" />
                    </div>
                    <Spacer />
                    <Spacer />
                </Collapse>
            </li>

            <li>
                <div>
                    <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(2)}>
                        <b>Add comments for potential delay.</b>
                    </MyButton>
                </div>
                <Collapse in={expandIndex === 2}>
                    <Spacer />
                    <Spacer />
                    <div>
                        <Image src={addCommentGif} alt="Fill timeslots" />
                    </div>
                    <Spacer />
                    <Spacer />
                    <Spacer />
                </Collapse>
            </li>

            <li>
                <div>
                    <MyButton variant="contained" color='inherit' onClick={() => setExpandIndex(3)}>
                        <b>Add users and try to highlight available timeslots</b>
                    </MyButton>
                </div>
                <Collapse in={expandIndex === 3}>
                    <Spacer />
                    <Spacer />
                    <div>
                        <Image src={hightLightsGif} alt="Fill timeslots" />
                    </div>
                </Collapse>
            </li>
        </ul>
        <Spacer height={300} />
    </div>
}