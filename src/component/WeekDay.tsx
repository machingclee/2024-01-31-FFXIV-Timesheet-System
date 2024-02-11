import { CSSProperties, PropsWithChildren, ReactNode } from "react"

const Weekday = ({ children, style = {} }: { children: ReactNode, style?: CSSProperties }) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: "0 15px",
            height: 25,
            paddingBottom: 0,
            borderRadius: 20,
            fontWeight: 600,
            ...style
        }}>
            {children}
        </div>
    )
}

export default Weekday;