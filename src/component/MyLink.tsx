import Link from "next/link"
import { ReactNode } from "react"
import { tss } from "tss-react";
import { TEXT_COLOR } from "./Body";




export default ({ className, href, children }: { className: string, href: string, children: ReactNode }) => {
    const { classes, cx } = linkStyles({});
    return (
        <Link
            className={cx(className, classes.link)}
            href={href}
        >
            {children}
        </Link>
    )
}

const linkStyles = tss.create(() => ({
    link: {
        "& button": {
            color: TEXT_COLOR
        }
    }
}))