const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const promisify = require('util').promisify;

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
var path = require('path');


const WriteTextToFileAsync = (filename, contentToWrite) => {

    try {

        const savePath = path.join(__dirname, '..', 'public','assets','samplejson',`floor${filename}.json`); 

        console.log(contentToWrite);
        fs.writeFile(savePath, JSON.stringify(contentToWrite,null,2), (err) => {
            if (err) return null;
        })

    } catch(err) {
        throw new Error(`Could not write file because of ${err}`);
    }
}

const OpenFileAsync = (filename) => {

    try {

        const savePath = path.join(__dirname, '..', 'public','assets','samplejson',`floor${filename}.json`); 

        fs.open(savePath, 'w+', (err) => {
            if (err) return null;            
        })
        

    } catch(err) {
        throw new Error(`Could not open file because of ${err}`);
    }
}

const DeleteFileAsync = (filename) => {

    try {

        const savePath = path.join(__dirname, '..', 'public','assets','samplejson',`floor${filename}.json`); 

        fs.unlink(savePath, (err) => {
            if (err) return null;            
        })

    } catch(err) {
        throw new Error(`Could not open file because of ${err}`);
    }
}

const WritePowerAndCurrentsAsync = (contentToWrite) => {

    try {
        const saveDevicePath = path.join(__dirname, '..', 'public','assets','samplejson','powerAndCurrents.json');
        console.log(contentToWrite);
        fs.writeFile(saveDevicePath, JSON.stringify(contentToWrite,null,2), (err) => {
            if (err) return null;
        })

    } catch(err) {
        throw new Error(`Could not write file because of {err}`);
    }
}


// Default route
app.get('/', (req, res) => res.status(200).send({ message : 'Hello world' }));


// Write route
app.use('/write', async (req, res, next) => {

    try {
        const fileContent = req.body.data;

        const fileName = req.body.fileId;
        console.log(fileContent);

        await WriteTextToFileAsync(fileName, fileContent);
        return res.status(200).send( { message: 'File written successfully!' });
    } catch (err) {
        throw new Error(`Could not write file because of {err}`);
    }
});

// open route
app.use('/open', async (req, res, next) => {

    try {
        const fileName = req.body.fileId;

        await OpenFileAsync(fileName);
        return res.status(200).send( { message: 'File Opened successfully!' });
    } catch (err) {
        throw new Error(`Could not open file because of ${err}`);
    }
});

// delete route
app.use('/delete', async (req, res, next) => {

    try {
        const fileName = req.body.fileId;

        await DeleteFileAsync(fileName);
        return res.status(200).send( { message: 'File deleted successfully!' });
    } catch (err) {
        throw new Error(`Could not delete file because of ${err}`);
    }
});

// Write route
app.use('/powerAndCurrents', async (req, res, next) => {

    try {
        const fileContent = req.body;


        await WritePowerAndCurrentsAsync(fileContent);
        return res.status(200).send( { message: 'File written successfully!' });
    } catch (err) {
        throw new Error(`Could not write file because of {err}`);
    }
});

// Not-found route
app.use((req, res, next) => {
    res.status(404).send({ message: 'Could not find the specified route you requested!' });
});

app.listen(port, () => console.log(`Server up and running and listening for incoming requests on port ${port}!`));

