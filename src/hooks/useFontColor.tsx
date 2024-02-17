import { TEXT_COLOR_LIGHT, TEXT_COLOR_DARK } from "@/component/Body";
import { useAppSelector } from "@/redux/hooks"

export default () => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    return darkMode ? TEXT_COLOR_LIGHT : `${TEXT_COLOR_DARK} !important`
}