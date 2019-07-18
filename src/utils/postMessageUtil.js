import EventBus from "@/utils/EventBus";
import {
    POST_MESSAGE_IFRAM_INIT
} from "@/utils/EventBusType";
let messageIFrameWindow;
let messageIFrameOrigin = "*";
let messageIFrameInit = false;

export const setMessageIFrame = (iFrameWindow, isTopIfram = false) => {
    messageIFrameWindow = iFrameWindow;
    if (!isTopIfram) {
        messageIFrameInit = true;
    }
    window.addEventListener("message", _addEventListener, false);
}

export const setIFrameOrigin = (iframeOrigin = "*") => {
    messageIFrameOrigin = iframeOrigin;
}

export const setIFrameInit = () => {
    messageIFrameWindow.postMessage("init", messageIFrameOrigin);
}
export const setMessage = (strJson) => {
    if (messageIFrameInit) {
        messageIFrameWindow.postMessage(strJson, messageIFrameOrigin);
    } else {
        console.log("接收方的Iframe还没初始化！");
    }
}
var _addEventListener = (e) => {
    if (messageIFrameOrigin == e.origin || messageIFrameOrigin == "*") {
        if (e.data === 'init') {
            messageIFrameInit = true;
            EventBus.$emit(POST_MESSAGE_IFRAM_INIT)
        } else {
            if (typeof (e.data) == "string") {
                try {
                    let obj = JSON.parse(e.data);
                    let method = obj.method;
                    EventBus.$emit(method, obj.data);
                } catch (e) {
                    console.log(e);
                }
                
            }

        }
    }
}