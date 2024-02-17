import { ReactNode, useState } from "react";

export default () => {
    const [rerenderFlag, setRerenderFlag] = useState(true);
    const rerender = () => {
        setRerenderFlag(false);
        setTimeout(() => setRerenderFlag(true), 1);
    };

    const Rerender = ({ children }: { children: ReactNode }) => {
        return <>{rerenderFlag && children}</>;
    };

    return { rerender, Rerender };
};