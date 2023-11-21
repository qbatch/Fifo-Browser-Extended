/* Copyright (c) 2021-2022 SnailDOS */

import { app, ipcRenderer, webFrame } from 'electron';

import AutoComplete from './models/auto-complete';
import { getTheme } from '~/utils/themes';
import { ERROR_PROTOCOL, WEBUI_BASE_URL } from '~/constants/files';
import { injectChromeWebstoreInstallButton } from './chrome-webstore';
import { contextBridge } from 'electron';
const tabId = ipcRenderer.sendSync('get-webcontents-id');

const { LANGUAGE, PLUGINS, COOKIES_ENABLED, DNT_HEADER, TIME_ZONE_OFFSET, TIME_ZONE } = process.env;

const timeZoneCode = `{
  const OriginalDate = Date;
  const updates = []; 
  const prefs = new Proxy({
    timezone: '${TIME_ZONE}',
    offset: ${TIME_ZONE_OFFSET}
  }, {
    set(target, prop, value) {
      target[prop] = value;
      if (prop === 'offset') { updates.forEach(c => c());}
      return true;
    }
  });
  class SpoofDate extends Date {
    #ad;
    #sync() {
      const offset = (prefs.offset + super.getTimezoneOffset());
      this.#ad = new OriginalDate(this.getTime() + offset * 60 * 1000);
    }
    constructor(...args) {
      super(...args);
      updates.push(() => this.#sync());
      this.#sync();
    }
    getTimezoneOffset() { return prefs.offset; }
    toTimeString() {
      if (isNaN(this)) { return super.toTimeString();}
      const parts = super.toLocaleString.call(this, 'en', {
        timeZone: prefs.timezone,
        timeZoneName: 'longOffset'
      }).split('GMT');
      if (parts.length !== 2) { return super.toTimeString(); }
      const a = 'GMT' + parts[1].replace(':', '');
      const b = super.toLocaleString.call(this, 'en', {
        timeZone: prefs.timezone,
        timeZoneName: 'long'
      }).split(/(AM |PM )/i).pop();
      return super.toTimeString.apply(this.#ad).split(' GMT')[0] + ' ' + a + ' (' + b + ')';
    }
    toDateString() { return super.toDateString.apply(this.#ad); }
    toString() { return this.toDateString() + ' ' + this.toTimeString(); }
    toLocaleDateString(...args) {
      args[1] = args[1] || {};
      args[1].timeZone = args[1].timeZone || prefs.timezone;
      return super.toLocaleDateString(...args);
    }
    toLocaleTimeString(...args) {
      args[1] = args[1] || {};
      args[1].timeZone = args[1].timeZone || prefs.timezone;
      return super.toLocaleTimeString(...args);
    }
    toLocaleString(...args) {
      args[1] = args[1] || {};
      args[1].timeZone = args[1].timeZone || prefs.timezone;
      return super.toLocaleString(...args);
    }
    #get(name, ...args) { return super[name].call(this.#ad, ...args); }
    getTimezoneOffset(...args) { return prefs.offset; }
    getDate(...args) { return this.#get('getDate', ...args); }
    getDay(...args) { return this.#get('getDay', ...args); }
    getHours(...args) { return this.#get('getHours', ...args); }
    getMinutes(...args) { return this.#get('getMinutes', ...args); }
    getMonth(...args) { return this.#get('getMonth', ...args); }
    getYear(...args) { return this.#get('getYear', ...args); }
    getFullYear(...args) { return this.#get('getFullYear', ...args); }
    #set(type, name, args) {
      if (type === 'ad') {
        const n = this.#ad.getTime();
        const r = this.#get(name, ...args);
        return super.setTime(this.getTime() + r - n);
      }
      else {
        const r = super[name](...args);
        this.#sync();
        return r;
      }
    }
    setHours(...args) { return this.#set('ad', 'setHours', args); }
    setMinutes(...args) { return this.#set('ad', 'setMinutes', args); }
    setMonth(...args) { return this.#set('ad', 'setMonth', args); }
    setDate(...args) { return this.#set('ad', 'setDate', args); }
    setYear(...args) { return this.#set('ad', 'setYear', args); }
    setFullYear(...args) { return this.#set('ad', 'setFullYear', args); }
    setTime(...args) { return this.#set('md', 'setTime', args); }
    setUTCDate(...args) { return this.#set('md', 'setUTCDate', args); }
    setUTCFullYear(...args) { return this.#set('md', 'setUTCFullYear', args); }
    setUTCHours(...args) { return this.#set('md', 'setUTCHours', args); }
    setUTCMinutes(...args) { return this.#set('md', 'setUTCMinutes', args); }
    setUTCMonth(...args) { return this.#set('md', 'setUTCMonth', args);}
  }
  self.Date = SpoofDate;
  self.Date = new Proxy(Date, {
    apply(target, self, args) {
      return new SpoofDate(...args);
    }
  });
  const DateTimeFormat = Intl.DateTimeFormat;
  const script = document.currentScript;
  class SpoofDateTimeFormat extends Intl.DateTimeFormat {
    constructor(...args) {
      if (!args[1]) { args[1] = {}; }
      if (!args[1].timeZone) { args[1].timeZone = prefs.timezone; }
      super(...args);
    }
  }
  Intl.DateTimeFormat = SpoofDateTimeFormat;
  Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
    apply(target, self, args) { return new Intl.DateTimeFormat(...args); }
  });
}`;

const createMaskingString = (obj: any, property: any, val: any) => `Object.defineProperty(${obj}, "${property}", { value: ${val} })`;

(async () => {
  await webFrame.executeJavaScript(createMaskingString('navigator', 'language', `'${LANGUAGE}'`));
  await webFrame.executeJavaScript(createMaskingString('navigator', 'languages', `['${LANGUAGE}']`));
  await webFrame.executeJavaScript(createMaskingString('navigator', 'plugins', PLUGINS));
  await webFrame.executeJavaScript(createMaskingString('navigator', 'cookieEnabled', COOKIES_ENABLED));
  await webFrame.executeJavaScript(createMaskingString('navigator', 'doNotTrack', DNT_HEADER));
  await webFrame.executeJavaScript(timeZoneCode)
})();

export const windowId: number = ipcRenderer.sendSync('get-window-id');

const goBack = async () => {
  await ipcRenderer.invoke(`web-contents-call`, {
    webContentsId: tabId,
    method: 'goBack',
  });
};

const goForward = async () => {
  await ipcRenderer.invoke(`web-contents-call`, {
    webContentsId: tabId,
    method: 'goForward',
  });
};

window.addEventListener('mouseup', async (e) => {
  if (e.button === 3) {
    e.preventDefault();
    await goBack();
  } else if (e.button === 4) {
    e.preventDefault();
    await goForward();
  }
});

let beginningScrollLeft: number = null;
let beginningScrollRight: number = null;
let horizontalMouseMove = 0;
let verticalMouseMove = 0;

const resetCounters = () => {
  beginningScrollLeft = null;
  beginningScrollRight = null;
  horizontalMouseMove = 0;
  verticalMouseMove = 0;
};

function getScrollStartPoint(x: number, y: number) {
  let left = 0;
  let right = 0;

  let n = document.elementFromPoint(x, y);

  while (n) {
    if (n.scrollLeft !== undefined) {
      left = Math.max(left, n.scrollLeft);
      right = Math.max(right, n.scrollWidth - n.clientWidth - n.scrollLeft);
    }
    n = n.parentElement;
  }
  return { left, right };
}

document.addEventListener('wheel', (e) => {
  verticalMouseMove += e.deltaY;
  horizontalMouseMove += e.deltaX;

  if (beginningScrollLeft === null || beginningScrollRight === null) {
    const result = getScrollStartPoint(e.deltaX, e.deltaY);
    beginningScrollLeft = result.left;
    beginningScrollRight = result.right;
  }
});

ipcRenderer.on('scroll-touch-end', async () => {
  if (
    horizontalMouseMove - beginningScrollRight > 150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollRight < 10) {
      await goForward();
    }
  }

  if (
    horizontalMouseMove + beginningScrollLeft < -150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollLeft < 10) {
      await goBack();
    }
  }

  resetCounters();
});

if (process.env.ENABLE_AUTOFILL) {
  window.addEventListener('load', AutoComplete.loadForms);
  window.addEventListener('mousedown', AutoComplete.onWindowMouseDown);
}

const postMsg = (data: any, res: any) => {
  window.postMessage(
    {
      id: data.id,
      result: res,
      type: 'result',
    },
    '*',
  );
};

const hostname = window.location.href.substr(WEBUI_BASE_URL.length);

if (
  process.env.ENABLE_EXTENSIONS &&
  window.location.host === 'chrome.google.com'
) {
  injectChromeWebstoreInstallButton();
}

const settings = ipcRenderer.sendSync('get-settings-sync');
if (
  window.location.href.startsWith(WEBUI_BASE_URL) ||
  window.location.protocol === `${ERROR_PROTOCOL}:`
) {
  (async function () {
    contextBridge.exposeInMainWorld('process', process);
    contextBridge.exposeInMainWorld('settings', settings);
    contextBridge.exposeInMainWorld('require', (id: string) => {
      if (id === 'electron') {
        return { ipcRenderer, app };
      }
      return undefined;
    });
    if (window.location.pathname.startsWith('//network-error')) {
      contextBridge.exposeInMainWorld('theme', getTheme(settings.theme));
      contextBridge.exposeInMainWorld(
        'errorURL',
        await ipcRenderer.invoke(`get-error-url-${tabId}`),
      );
    } else if (hostname.startsWith('history')) {
      contextBridge.exposeInMainWorld('getHistory', async () => {
        return await ipcRenderer.invoke(`history-get`);
      });
      contextBridge.exposeInMainWorld('removeHistory', (ids: string[]) => {
        ipcRenderer.send(`history-remove`, ids);
      });
    } else if (hostname.startsWith('newtab')) {
      contextBridge.exposeInMainWorld('getTopSites', async (count: number) => {
        return await ipcRenderer.invoke(`topsites-get`, count);
      });
    }
  })();
} else {
  (async function () {
    if (settings.doNotTrack) {
      await webFrame.executeJavaScript(
        `window.navigator.doNotTrack = { value: 1 }`,
      );
    }

    if (settings.globalPrivacyControl) {
      await webFrame.executeJavaScript(
        `window.navigator.globalPrivacyControl = true`,
      );
    }
  })();
}

if (window.location.href.startsWith(WEBUI_BASE_URL)) {
  window.addEventListener('DOMContentLoaded', () => {
    if (hostname.startsWith('settings')) document.title = 'Settings';
    else if (hostname.startsWith('history')) document.title = 'History';
    else if (hostname.startsWith('bookmarks')) document.title = 'Bookmarks';
    else if (hostname.startsWith('extensions')) document.title = 'Extensions';
    else if (hostname.startsWith('welcome')) document.title = 'Proxy-Browser Setup';
    else if (hostname.startsWith('changelog')) document.title = 'Updater';
    else if (hostname.startsWith('newtab')) document.title = 'New Tab';
  });

  window.addEventListener('message', async ({ data }) => {
    if (data.type === 'storage') {
      const res = await ipcRenderer.invoke(`storage-${data.operation}`, {
        scope: data.scope,
        ...data.data,
      });

      postMsg(data, res);
    } else if (data.type === 'credentials-get-password') {
      const res = await ipcRenderer.invoke(
        'credentials-get-password',
        data.data,
      );
      postMsg(data, res);
    } else if (data.type === 'save-settings') {
      ipcRenderer.send('save-settings', { settings: data.data });
    }
  });

  ipcRenderer.on('update-settings', async (e, data) => {
    await webFrame.executeJavaScript(
      `window.updateSettings(${JSON.stringify(data)})`,
    );
  });

  ipcRenderer.on('credentials-insert', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-insert',
        data,
      },
      '*',
    );
  });

  ipcRenderer.on('credentials-update', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-update',
        data,
      },
      '*',
    );
  });

  ipcRenderer.on('credentials-remove', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-remove',
        data,
      },
      '*',
    );
  });
}
