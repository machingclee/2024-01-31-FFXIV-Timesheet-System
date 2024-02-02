import { useSearchParams } from "next/navigation"

export default <T extends Record<string, string>>() => {
    const searchParams = useSearchParams();
    const get = (key: keyof T) => searchParams.get(key as string);
    return { get };
}