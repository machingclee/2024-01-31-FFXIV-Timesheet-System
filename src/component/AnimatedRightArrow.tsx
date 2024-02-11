import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi"




export default () => {
    const classes = useStyles();
    const [startAni, setStartAni] = useState(false);
    useEffect(() => {
        setStartAni(true)
        setInterval(() => {
            setStartAni(false)
            setTimeout(() => setStartAni(true), 10)
        }, 1500)
    }, [])
    return <HiOutlineChevronDoubleRight
        style={{
            transform: "translateX(-5px)",
            opacity: 0
        }}
        className={startAni ? classes.move : ""}
        size={22}
    />
}


const useStyles = makeStyles((theme) => ({
    move: {
        animation: `$moveAnimation 1000ms ease-in-out`,
    },
    "@keyframes moveAnimation": {
        "0%": {
            transform: "translateX(-5px)",
            opacity: 0
        },
        "10%": {
            transform: "translateX(-5px)",
            opacity: 0.5
        },
        "50%": {
            transform: "translateX(5px)",
            opacity: 1
        },
        "51%": {
            transform: "translateX(-5px)",
            opacity: 0
        },
        "90%": {
            transform: "translateX(5px)",
            opacity: 1
        },
        "100%": {
            transform: "translateX(5px)",
            opacity: 0
        },
    },
}));