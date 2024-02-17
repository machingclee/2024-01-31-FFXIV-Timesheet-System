import {
    AnyAction,
    ListenerEffect,
    ListenerMiddlewareInstance,
    ThunkDispatch,
    isAnyOf
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
// import snackbarUtils from "./snackbarUtils";

type Effect = ListenerEffect<any, unknown, ThunkDispatch<unknown, unknown, AnyAction>, unknown>;

/**
 * actionMessageList consists of objects either of the form { action, content } or  of the form { rejections } / { rejections, content }. When content is absent, the error message is supposed to be returned by thunkAPI.rejectWithValue
 * in createAsyncThunk function.
 */

const messageDispatch = ({ contentType, content }: { contentType: string, content: string }) => {
    if (contentType === "sucesss") {
        // snackbarUtils.success(content)
    } else if (contentType === "info") {
        // snackbarUtils.info(content)
    } else if (contentType === "warning") {
        // snackbarUtils.warning(content)
    } else if (contentType === "error") {
        // snackbarUtils.error(content);
    }
}


export default (
    middleware: ListenerMiddlewareInstance<
        unknown,
        ThunkDispatch<unknown, unknown, AnyAction>,
        unknown
    >,
    actionMessageList: {
        action?: any,
        rejections?: any[],
        content?: string
        effect?: Effect
        contentType?: "sucesss" | "info" | "error" | "warning"
    }[]
) => {
    for (const actionMessage of actionMessageList) {
        const { action, rejections, content, effect, contentType = "sucesss" } = actionMessage;

        if (action) {
            let effect_: Effect;
            if (effect) {
                effect_ = effect;
            } else if (content) {
                effect_ = async (action, { dispatch }) => {
                    messageDispatch({ contentType, content })
                    // dispatch(appSlice.actions.updateNotification(
                    //     { open: true, content: content || "No Message" }
                    // ))
                };
            } else {
                effect_ = async (action, thunkAPI) => { };
            }

            middleware.startListening({ actionCreator: action, effect: effect_ });

        } else if (rejections) {
            if (effect) {
                // @ts-ignore
                middleware.startListening({ matcher: isAnyOf(...rejections), effect });
            } else {
                middleware.startListening({
                    // @ts-ignore
                    matcher: isAnyOf(...rejections),
                    effect: async (action, { dispatch }) => {
                        if (content) {
                            messageDispatch({ contentType, content })
                            // dispatch(appSlice.actions.updateNotification(
                            //     { open: true, content: content || "No Message" }
                            // ))
                        } else {
                            const msg = action?.payload as string;
                            let errMsg = "Failed";
                            if (msg) {
                                errMsg = msg;
                                toast.error(
                                    errMsg,
                                    {
                                        toastId: errMsg,
                                        position: "top-center",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "colored",
                                    })
                            }
                        }
                    }
                })
            }

        }
    }
}