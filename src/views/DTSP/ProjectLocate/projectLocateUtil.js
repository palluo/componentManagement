import {getUrlKey} from "../utils/httpUtil";

export const getLocateParm =() =>{
    let businesscode = getUrlKey("businesscode");
    let businesstype = getUrlKey("businesstype");
    let slbh = getUrlKey("slbh");
    let cadstorage = getUrlKey("cadstorage");
    let saveanalysis = getUrlKey("saveanalysis");
    let locatpara;
    if (businesscode && slbh && businesscode.length > 0 && slbh.length > 0) {
      locatpara = {
        businesstype: businesstype,
        businesscode: businesscode,
        slbh: slbh,
        cadstorage: cadstorage,
        saveanalysis: saveanalysis,
        mode: "business_sp"
      };
    } else {
      //自定义一种虚拟类型，提供手动编辑范围上传SOE，并检测
      locatpara = {
        businesstype: "办理《建设项目选址意见书》",
        businesscode: "gz2511001-001",
        slbh: "2018000000003678",
        cadstorage: "true",
        saveanalysis: "false",
        mode: "custom_check"
      };
    }
    return locatpara;
}