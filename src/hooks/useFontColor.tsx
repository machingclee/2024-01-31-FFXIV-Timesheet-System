import { TEXT_COLOR, TEXT_DARK_COLOR } from "@/component/Body";
import { useAppSelector } from "@/redux/hooks"

export default () => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    return darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`
}