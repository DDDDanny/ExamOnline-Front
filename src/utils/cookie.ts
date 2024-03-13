// 设置Cookie
function setCookie(key: string, value: string) {
  const d = new Date();
  d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = key + "=" + value + "; " + expires;
}

// 获取Cookie
function getCookie(key: string) {
  const name = key + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// 删除Cookies
function delCookie() {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length ; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  }
}

export { setCookie, getCookie, delCookie };
