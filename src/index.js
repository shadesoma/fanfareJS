const { app, BrowserWindow, globalShortcut, Menu, Tray } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let tray = null
app.whenReady().then(() => {
  tray = new Tray(__dirname + '/assets/icons/1f389.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Close', type: 'normal' },
  ])
  contextMenu.items[0].click = () => app.quit()
  tray.setContextMenu(contextMenu)
})

const createWindow = () => {

  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getAllWindows()[0].close()
  }
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    transparent: true,
    frame: false,
    fullscreen: true,
    icon: __dirname + '/assets/icons/1f389.png'
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

if (process.platform === 'linux') {
  // let appIcon = null
  // app.whenReady().then(() => {
  //   appIcon = new Tray(__dirname + '/assets/icons/1f389.png')
  //   const contextMenu = Menu.buildFromTemplate([
  //     { label: 'Close', type: 'normal' },
  //   ])
  //
  //   // Make a change to the context menu
  //   contextMenu.items[0].click = () => app.quit()
  //
  //   // Call this again for Linux because we modified the context menu
  //   appIcon.setContextMenu(contextMenu)
  // })

  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    globalShortcut.register('CommandOrControl+W', createWindow)
  } else {
    BrowserWindow.getAllWindows()[0].close()
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

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
