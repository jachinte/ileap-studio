const electron = require("electron");
const { app, dialog, BrowserWindow, Menu } = electron;

var info = require('../package.json');
const path = require("path");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
autoUpdater.checkForUpdatesAndNotify();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 600 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  // Create the Application's main menu
  var template = [
    {
      label: "Application",
      submenu: [
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            app.quit();
          }
        },
        {
          label: "About",
          click: function() {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              buttons: ["OK"],
              title: "iLeap Studio",
              message: "About",
              detail: `You are running iLeap Studio v${info.version}.`
            }, resp => {
              console.log(resp);
            });
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ];
  if (!isDev) Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
