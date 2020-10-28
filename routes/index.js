const express = require('express');
let router = express.Router();

const formidable = require('formidable');
const fs = require('fs');
const fsPromises = require('fs').promises;
const csv = require('fast-csv');

/**
 * process the csv
 */
router.post('/upload', function (req, res, next) {

    let response = {};

    extractfileFromForm(req)
        .then(form => {
            console.log(form);
            response.name = form.appName;
            response.description = form.appDesc;
            response.runtime = form.appRuntime;
            return parsefile(form.apiFile)
        })
        .then(apis => {
            console.log(apis);
            return buildTemplate(apis, response.name, response.description, response.runtime)
        })
        .then(fileName => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            fs.createReadStream(fileName).pipe(res);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
            res.json(err);
        })
});

module.exports = router;


/**
 * @param req
 * @return {Promise<string> : the path to the csv file}
 */
function extractfileFromForm(req)
{
    return new Promise(function (resolve, reject) {

        const form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            if(err)
                reject(err);
            else {
                const appName = fields['appName'];
                const appDesc = fields['appDesc'];
                const appRuntime = fields['appRuntime'];

                resolve({
                    appName: appName,
                    appDesc : appDesc,
                    appRuntime : appRuntime,
                    apiFile : files.csv.path
                });
            }
        });
    })
}

function parsefile(path)
{
    return new Promise(function (resolve, reject) {

    let fileRows = [];

    console.log("processing " + path)

    csv.parseFile(path, { delimiter: ";", headers: true })

        .on("data", function (data) {

            console.log(data);

            // record element as json
            fileRows.push({
                endpoint : data.endpoint,
                method : data.method,
                description : data.description,
                handler : data.handler
            });

        })

        .on("end", function () {
            fs.unlinkSync(path);   // remove temp file
            resolve(fileRows);
        })

        .on("error", function(error) {
            fs.unlinkSync(path);
            reject(error);
        })
    });
}

async function  buildTemplate(apis, appName, appDescription, appRuntime)
{
    const fileName = 'template.yml';
    const handlerPath = 'src/handlers/';

    await fsPromises.writeFile(fileName, '# This is the SAM template that represents the architecture of your serverless application \n');

    await fsPromises.appendFile(fileName, 'AWSTemplateFormatVersion: 2010-09-09 \n');
    await fsPromises.appendFile(fileName, 'Description: >- \n');
    await fsPromises.appendFile(fileName, '  ' + appName + '\n');
    await fsPromises.appendFile(fileName, 'Transform: \n');
    await fsPromises.appendFile(fileName, '- AWS::Serverless-2016-10-31 \n');
    await fsPromises.appendFile(fileName, '\n');
    await fsPromises.appendFile(fileName, 'Resources: \n');

    let count = 0;
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    for (const api of apis) {
        count++;

        const name = 'function_' + zeroPad(count, 4);

        await fsPromises.appendFile(fileName, '  ' + name+ ':' + '\n');
        await fsPromises.appendFile(fileName, '    ' + 'Type: AWS::Serverless::Function' + '\n');
        await fsPromises.appendFile(fileName, '    ' + 'Properties:' + '\n');
        await fsPromises.appendFile(fileName, '      ' + 'Handler: ' + handlerPath + api.handler + '\n');
        await fsPromises.appendFile(fileName, '      ' + 'Runtime: ' + appRuntime + '\n');
        await fsPromises.appendFile(fileName, '      ' + 'MemorySize: 128' + '\n');
        await fsPromises.appendFile(fileName, '      ' + 'Timeout: 100' + '\n');
        await fsPromises.appendFile(fileName, '      ' + 'Description: ' + api.description + '\n');
        await fsPromises.appendFile(fileName, '      ' + 'Event: ' + '\n');
        await fsPromises.appendFile(fileName, '        ' + 'Api:' + '\n');
        await fsPromises.appendFile(fileName, '          ' + 'Type: Api' + '\n');
        await fsPromises.appendFile(fileName, '          ' + 'Properties:' + '\n');
        await fsPromises.appendFile(fileName, '            ' + 'Path: ' + api.endpoint + '\n');
        await fsPromises.appendFile(fileName, '            ' + 'Method: ' + api.method + '\n');
        await fsPromises.appendFile(fileName, '\n');
    }

    await fsPromises.appendFile(fileName, '\n');
    await fsPromises.appendFile(fileName,  'Outputs:' + '\n');
    await fsPromises.appendFile(fileName,  '  ' + 'WebEndpoint:' + '\n');
    await fsPromises.appendFile(fileName,  '    ' + 'Description: "' + appDescription + '"' + '\n');
    await fsPromises.appendFile(fileName,  '    ' + 'Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"' + '\n');

    return fileName;

}
