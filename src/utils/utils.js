/**
 * @Project Name: vue-admin
 * @Author: luichooy
 * @Date: 2017-11-20 10:19
 * @Email: luichooy@163.com
 * @Idea: WebStorm
 */

/* export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}; */

export default {
  HashTable: function () {
    let size = 0;
    let entry = [];
    this.add = function (key, value) {
      if (!this.containsKey(key)) {
        size++;
      }
      entry[key] = value;
    }
    this.getValue = function (key) {
      return this.containsKey(key) ? entry[key] : null;
    }
    this.remove = function (key) {
      if (this.containsKey(key) && (delete entry[key])) {
        size--;
      }
    }
    this.containsKey = function (key) {
      return (key in entry);
    }
    this.containsValue = function (value) {
      for (let prop in entry) {
        if (entry[prop] === value) {
          return true;
        }
      }
      return false;
    }
    this.getValues = function () {
      let values = [];
      for (let prop in entry) {
        values.push(entry[prop]);
      }
      return values;
    }
    this.getKeys = function () {
      let keys = [];
      for (let prop in entry) {
        keys.push(prop);
      }
      return keys;
    }
    this.getSize = function () {
      return size;
    }
    this.clear = function () {
      size = 0;
      entry = [];
    }
  },
  generateId: function (n) {
    if (n > 21) return null;
    return (parseInt((Math.random() + 1) * Math.pow(10, n - 1)) + parseInt(Math.random() * 3));
  },
  padLeftZero: function (str) {
    return ('00' + str).substr(str.length);
  },
  formatDate: function (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
      }
    }
    return fmt;
  },
  dateToString (time, format) {
    if (time === null || time === '' || time === undefined) {
      return '';
    }
    if (format === null || format === '') {
      format = 'yyyy-MM-dd hh:mm:ss';
    }
    if (time instanceof Date) {
      return this.formatDate(time, format);
    } else {
      return time.split(' ')[0];
    }
  },
  isEmpty (val) {
    if (val === null || val === '' || val === undefined) {
      return true;
    }
    return false;
  },
  isNotEmpty (val) {
    if (val !== null && val !== '' && val !== undefined) {
      return true;
    }
    return false;
  }/* ,
  encrypt(data) {
    // 新建JSEncrypt对象
    let encryptor = new JSEncrypt();
    // 设置公钥
    encryptor.setPublicKey(publicKey);
    // 加密数据
    return encryptor.encrypt(data);
  },
  // 解密
  decrypt(data) {
    // 新建JSEncrypt对象
    let decrypt= new this.Encrypt.JSEncrypt();
    // 设置私钥
    decrypt.setPrivateKey(privateKey);
    // 解密数据
    decrypt.decrypt(data);
  } */
};
