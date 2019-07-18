import { JGET } from "@/plugins/axios";

export function getPrivilege() {
    return JGET(
        "static/mockdata/DTSP_JSON/privilege.json",
        "获取带图审批权限文件"
    );
}