/* Copyright (c) 2021-2022 SnailDOS */

export const injectChromeWebstoreInstallButton = () => {
  const baseUrl =
    'https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=%VERSION&x=id%3D%ID%26installsource%3Dondemand%26uc';

  function waitForCreation(selector: any, callback: any) {
    const element = document.querySelector(selector);
    if (element != null) {
      callback(element);
    }
  }

  function checkAndInjectButton() {
    if (window.location.href.includes('https://chromewebstore.google.com')) {
      waitForCreation('button.UywwFc-LgbsSe.UywwFc-LgbsSe-OWXEXe-dgl2Hf', (element: any) => {
        const warningBanner = document.querySelector('div.gSrP5d');
        if (warningBanner) warningBanner.remove();
        InstallButton(document.querySelector('div.OdjmDb'));
      });
    }
  }

  // Use setInterval for periodic checking every 500ms
  setInterval(checkAndInjectButton, 500);

  function installPlugin(
    id: string,
    version = navigator.userAgent.match(/(?<=Chrom(e|ium)\/)\d+\.\d+/)[0],
  ) {
    window.location.href = baseUrl
      .replace('%VERSION', version)
      .replace('%ID', id);
  }

  function InstallButton(
    this: any,
    wrapper: any,
    id = document.URL.match(/(?<=\/)(\w+)(\?|$)/)[1],
  ) {
    if (wrapper == null) return;
    const oldButton = document.querySelector('button.UywwFc-LgbsSe.UywwFc-LgbsSe-OWXEXe-dgl2Hf');
    if (oldButton) oldButton.remove();
    const newButton = document.createElement('button');
    newButton.innerText = 'Add to Proxy Browser';
    newButton.className = 'UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf';
    newButton.style.color = 'white';

    newButton.addEventListener('click', () => {
      installPlugin(id);
    });

    wrapper.appendChild(newButton);
  }
};
