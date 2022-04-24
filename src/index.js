const { app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron');
const path = require('path');
var AutoLaunch = require('auto-launch');

var MyAutoLauncher = new AutoLaunch({
	name: 'FanfareJS',
	path: app.getPath('exe'),
});

MyAutoLauncher.enable();

MyAutoLauncher.isEnabled()
.then(function(isEnabled){
	if(isEnabled){
	    return;
	}
	MyAutoLauncher.enable();
})
.catch(function(err){
    // handle error
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let tray = null;

let mainWindow = null

const createWindow = () => {
  if (BrowserWindow.getFocusedWindow()) {
    mainWindow.close()
    return
  }

  mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    show: false,
    transparent: true,
    frame: false,
    fullscreen: true,
    icon: __dirname + '/assets/icons/icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    nodeIntegration: false,
    contextIsolation: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  tray = new Tray(__dirname + '/assets/icons/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Close', type: 'normal' },
  ])
  contextMenu.items[0].click = () => app.quit()
  tray.setContextMenu(contextMenu)


  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

app.on('ready', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    globalShortcut.register('CommandOrControl+5', createWindow)
  } else {
    mainWindow.close();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.hide()
  }
});
