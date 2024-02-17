import { useAppSelector } from "@/redux/hooks"

export default () => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    return darkMode;
}
