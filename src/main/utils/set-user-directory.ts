import * as path from 'path';
import * as fs from 'fs';

const setUserDirectory = (app: any, directoryName: any) => {
  const appSupportPath = app.getPath('appData');
  const newDirectoryPath = path.join(
    appSupportPath,
    'ProxyBrowser',
    directoryName,
  );
  
  if (!fs.existsSync(newDirectoryPath)) fs.mkdirSync(newDirectoryPath, { recursive: true });
  app.setPath('userData', newDirectoryPath);
};

export default setUserDirectory;
