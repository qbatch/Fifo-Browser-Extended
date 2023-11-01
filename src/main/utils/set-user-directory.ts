import * as path from 'path';
import * as fs from 'fs';
import { set } from 'mobx';

const setUserDirectory = (app: any, directoryName: any) => {
  const appSupportPath = app.getPath('appData');
  const newDirectoryPath = path.join(
    appSupportPath,
    'ProxyBrowser',
    directoryName,
  );
  if (!fs.existsSync(newDirectoryPath)) {
    fs.mkdirSync(newDirectoryPath, { recursive: true });
  }
  const sourceDirPath = app.getPath('userData');
  if (!fs.existsSync(sourceDirPath)) {
    fs.mkdirSync(sourceDirPath, { recursive: true });
  }
  fs.renameSync(sourceDirPath, newDirectoryPath);
  app.setPath('userData', newDirectoryPath);
};

export default setUserDirectory;
