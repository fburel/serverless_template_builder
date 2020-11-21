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
            response.apis = apis;
            console.log(apis);

            let files = [];

            apis.forEach(api => {
                const fileName = api.handler.split('.')[0];

                if(!files.includes(fileName))
                {
                    files.push(fileName);
                }
            })

            response.files = files;

            response.template = buildTemplate(apis, response.name, response.description, response.runtime)

            return Promise.resolve(response.template);

        })

        .then(fileName => {

            return createFiles(response.files);

        })

        .then(() => {

            return fillApifiles(response.apis);

        })

        .then(() => {
            res.json(response);
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

function buildTemplate(apis, appName, appDescription, appRuntime)
{
    let string = '';

    let count = 0;
    const zeroPad = (num, places) => String(num).padStart(places, '0')


    function append(str, data)
    {
        return str + data;
    }

    const handlerPath = 'src/handlers/';

    string = string + '# This is the SAM template that represents the architecture of your serverless application \n';
    string = string +'AWSTemplateFormatVersion: 2010-09-09 \n';
    string = string +'Description: >- \n';
    string = string +'  ' + appName + '\n';
    string = string +'Transform: \n';
    string = string + '- AWS::Serverless-2016-10-31 \n';
    string = string + '\n';
    string = string + 'Resources: \n';

    for (const api of apis) {

        count++;

        const name = 'Serverless' + zeroPad(count, 4);

        string = append(string, '  ' + name+ ':' + '\n');
        string = append(string, '    ' + 'Type: AWS::Serverless::Function' + '\n');
        string = append(string, '    ' + 'Properties:' + '\n');
        string = append(string, '      ' + 'Handler: ' + handlerPath + api.handler + '\n');
        string = append(string, '      ' + 'Runtime: ' + appRuntime + '\n');
        string = append(string, '      ' + 'MemorySize: 128' + '\n');
        string = append(string, '      ' + 'Timeout: 100' + '\n');
        string = append(string, '      ' + 'Description: ' + api.description + '\n');
        string = append(string, '      ' + 'Events: ' + '\n');
        string = append(string, '        ' + 'Api:' + '\n');
        string = append(string, '          ' + 'Type: Api' + '\n');
        string = append(string, '          ' + 'Properties:' + '\n');
        string = append(string, '            ' + 'Path: ' + api.endpoint + '\n');
        string = append(string, '            ' + 'Method: ' + api.method + '\n');
        string = append(string, '\n');
    }

    string = append(string, '\n');
    string = append(string,  'Outputs:' + '\n');
    string = append(string,  '  ' + 'WebEndpoint:' + '\n');
    string = append(string,  '    ' + 'Description: "' + appDescription + '"' + '\n');
    string = append(string,  '    ' + 'Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/"' + '\n');

    return string;

}

async function createFiles(files)
{
    for(const file of files)
    {
        await fsPromises.writeFile('tmp/' + file + '.js', '');
    }
}

async function fillApifiles(apis)
{
    for(const api of apis)
    {
        const splits = api.handler.split('.');
        const filename = splits[0] + '.js';
        const path = 'tmp/' + filename;
        const func = api.handler.split('.')[1];

        let methodTemplate = "/**\n" +
    " * {{ desc }}\n" +
    " */\n" +
    "exports.{{ name }} = async (event) => {\n" +
    "    if (event.httpMethod !== '{{ method }}') {\n" +
    "        throw new Error('{{ fileName }}.{{ name }} only accept {{ method }} method, you tried:' + event.httpMethod );\n" +
    "    }\n" +
    "\n" +
    "    try {\n" +
    "\n" +
    "\n" +
    "        return {\n" +
    "            statusCode: 418,\n" +
    "            body: JSON.stringify({})\n" +
    "        };\n" +
    "\n" +
    "    } catch (e)\n" +
    "    {\n" +
    "        return {\n" +
    "            statusCode: 500,\n" +
    "            body: JSON.stringify(e)\n" +
    "        };\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "\n";

        methodTemplate = methodTemplate.replace(/{{ fileName }}/gi, filename);
        methodTemplate = methodTemplate.replace(/{{ name }}/gi, func);
        methodTemplate = methodTemplate.replace(/{{ desc }}/gi, api.description);
        methodTemplate = methodTemplate.replace(/{{ method }}/gi, api.method);

        await fsPromises.appendFile(path, methodTemplate);
    }
}




// async function  buildTemplate(apis, appName, appDescription, appRuntime)
// {
//     const fileName = 'template.yml';
//     const handlerPath = 'src/handlers/';
//
//     await fsPromises.writeFile(fileName, '# This is the SAM template that represents the architecture of your serverless application \n');
//
//     await fsPromises.appendFile(fileName, 'AWSTemplateFormatVersion: 2010-09-09 \n');
//     await fsPromises.appendFile(fileName, 'Description: >- \n');
//     await fsPromises.appendFile(fileName, '  ' + appName + '\n');
//     await fsPromises.appendFile(fileName, 'Transform: \n');
//     await fsPromises.appendFile(fileName, '- AWS::Serverless-2016-10-31 \n');
//     await fsPromises.appendFile(fileName, '\n');
//     await fsPromises.appendFile(fileName, 'Resources: \n');
//
//     let count = 0;
//     const zeroPad = (num, places) => String(num).padStart(places, '0')
//
//     for (const api of apis) {
//         count++;
//
//         const name = 'function_' + zeroPad(count, 4);
//
//         await fsPromises.appendFile(fileName, '  ' + name+ ':' + '\n');
//         await fsPromises.appendFile(fileName, '    ' + 'Type: AWS::Serverless::Function' + '\n');
//         await fsPromises.appendFile(fileName, '    ' + 'Properties:' + '\n');
//         await fsPromises.appendFile(fileName, '      ' + 'Handler: ' + handlerPath + api.handler + '\n');
//         await fsPromises.appendFile(fileName, '      ' + 'Runtime: ' + appRuntime + '\n');
//         await fsPromises.appendFile(fileName, '      ' + 'MemorySize: 128' + '\n');
//         await fsPromises.appendFile(fileName, '      ' + 'Timeout: 100' + '\n');
//         await fsPromises.appendFile(fileName, '      ' + 'Description: ' + api.description + '\n');
//         await fsPromises.appendFile(fileName, '      ' + 'Event: ' + '\n');
//         await fsPromises.appendFile(fileName, '        ' + 'Api:' + '\n');
//         await fsPromises.appendFile(fileName, '          ' + 'Type: Api' + '\n');
//         await fsPromises.appendFile(fileName, '          ' + 'Properties:' + '\n');
//         await fsPromises.appendFile(fileName, '            ' + 'Path: ' + api.endpoint + '\n');
//         await fsPromises.appendFile(fileName, '            ' + 'Method: ' + api.method + '\n');
//         await fsPromises.appendFile(fileName, '\n');
//     }
//
//     await fsPromises.appendFile(fileName, '\n');
//     await fsPromises.appendFile(fileName,  'Outputs:' + '\n');
//     await fsPromises.appendFile(fileName,  '  ' + 'WebEndpoint:' + '\n');
//     await fsPromises.appendFile(fileName,  '    ' + 'Description: "' + appDescription + '"' + '\n');
//     await fsPromises.appendFile(fileName,  '    ' + 'Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"' + '\n');
//
//     return fileName;
//
// }
