/*
 * @Author: LancerSung
 * @LastEditors: LancerSung
 * @Date: 2019-03-18 14:40:16
 * @LastEditTime: 2019-03-18 20:40:13
 */

export default fn => {
  let called = false;
  let ret;

  return () => {
    if (!called) {
      called = true;
      ret = fn();
    }

    return ret;
  };
};
