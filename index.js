const { app, BrowserWindow, dialog } = require('electron')
const AdmZip = require('adm-zip')
const fs = require('fs')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 600
    })
  
    openFileDialog(win)
   // win.loadFile('index.html')

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
                //alert("ALPHA-Nachricht: Navigation gestoppt: Es ist keine Navigation durch das Archiv möglich.")
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