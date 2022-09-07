const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const AdmZip = require('adm-zip')
const fs = require('fs')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
  
    ipcMain.on("open-file-dialog", (event, arg) => {
        openFileDialog(win);
    });

    win.loadFile('view/index.html')

}

const openFileDialog = (win) => {
    clearWorkspace()

    dialog.showOpenDialog(
        { 
        filters: [
            {name: "Wochenplan Archiv", extensions:["wparch"]},
            {name: 'Alle Dateien', extensions: ['*']}
        ],
        properties: ['openFile'] 
        }
    )
    .then((resp) => {
        if (!resp.canceled) {
            console.log(resp.filePaths[0]);

            let zip = AdmZip(resp.filePaths[0]);

            zip.extractAllTo(getWorkSpacePath());

            win.loadFile(getWorkSpacePath() + "/WPAPP-PLAN-SAVE/plan.html")

            win.webContents.addListener('will-navigate', (event, toUrl) => {
                event.preventDefault();
            })

            win.webContents.addListener('new-window', (event) => {
                event.preventDefault();
            })
        }
    })
}

app.whenReady().then(() => {
    createWindow()
})

const clearWorkspace = () => {
    let path = getWorkSpacePath();

    if (fs.existsSync(path)) {
        fs.rmSync(path, {recursive: true})
    }
}

const getWorkSpacePath = () => {
    return app.getPath("userData") + "/workspace";
}