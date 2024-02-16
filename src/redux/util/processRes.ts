import { MyResponse } from "@/dto/dto";
import { AxiosResponse } from "axios";

export const processRes = <T,>(res: AxiosResponse<MyResponse<T>, any>, api: any): T => {
    if (!res.data.success) {
        return api.rejectWithValue(res.data.errorMessage);
    } else {
        return res.data.result;
    }
}