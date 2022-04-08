const { app, BrowserWindow, dialog } = require('electron')
const AdmZip = require('adm-zip')
const { get } = require('http')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 600
    })
  
    win.loadFile('index.html')

    let file = dialog.showOpenDialog(
        { 
        filters: [
            {name: "Wochenplan Archiv", extensions:["wparch"]},
            { name: 'Alle Dateien', extensions: ['*'] }
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
                console.log(toUrl);
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

const getWorkSpacePath = () => {
    return app.getPath("userData") + "/workspace";
}