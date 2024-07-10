import {notification} from "ant-design-vue";
import settings from "@/config/settings";

export function notifySuccess(title, desc = '', key = settings.notificationKeyCommon){
    notification.success({
        key: key,
        message: title,
        description: desc,
    });
}

export function notifyError(title, desc = '', key = settings.notificationKeyCommon){
    notification.error({
        key: key,
        message: title,
        description: desc,
    });
}

export function notifyWarn(title, desc = '', key = settings.notificationKeyCommon){
    notification.warning({
        key: key,
        message: title,
        description: desc ? desc : '',
    });
}
