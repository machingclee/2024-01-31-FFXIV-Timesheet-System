import { AppStore } from "@/redux/store";

export default class {
    public static store: AppStore
    public static enableList: Map<number, boolean> = new Map<number, boolean>();
}