const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const fs = require('fs');
const os = require('os');
const path = require('path');
const desktopPath = path.join(os.homedir(), 'Desktop');
const dataFolderPath = path.join(desktopPath, 'fila de atendimento');
//=========================================================================================



app.get('/', (req, res) => {
  res.send('Servidor ligado!')

})

function start() {
  //Creates folder when application starts, preventing user to do it
  fs.mkdir(dataFolderPath, (err) => {
    if (err) { }// console.error(err);
  });
} start()



//Receives data from device connected to localhost
app.post('/input', (req, res) => {
  const data = req.body.text;
  console.log(`Server: input text received: ${data}`);
   res.send(`Server: received from android: ${data}`);
  sendDataToDesktop(data)
});


//Sends data to desktop's folder 
function sendDataToDesktop(data) {
  fs.mkdir(dataFolderPath, { recursive: true }, (err) => {
    // create data folder if it doesn't exist
    if (err) throw err;

    fs.readdirSync(dataFolderPath) // read files in folder
      .filter(file => path.extname(file) === '.txt') // filter only txt files
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(dataFolderPath, file)).ctime.getTime() // get creation time
      })) // map to object with filename and creation time
      .sort((a, b) => b.time - a.time); // sort by creation time (most recent first)
    //   console.log(files); // log the sorted files array

    const fileName = `${data}_${Date.now()}.txt`;
    const filePath = path.join(dataFolderPath, fileName);
    // create 'visitante.txt' file
    fs.writeFile(filePath, data, (err) => {
      if (err) throw err;
      //   console.log('File created successfully');
    });
  });

}


app.listen(port, () => {
  console.log(`Server is on!`);
});












/* server.get('/', (req, res) => {
  res.send('Hello World!')
}) */



//const { exec } = require('child_process');

// Windows command to shut down PC

/* const { spawn } = require('child_process');

const folderPath = 'C:/Users/weler/Desktop/Code/Testes/expo back4app/react/normal react/my-app';
const command = 'npm start';

const options = {
  cwd: folderPath,
  shell: true
};

const child = spawn(command, options);

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
}); */
