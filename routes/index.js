const express = require('express');
let router = express.Router();

const formidable = require('formidable');
const fs = require('fs');
const fsPromises = require('fs').promises;
const csv = require('fast-csv');
var AdmZip = require('adm-zip');

/**
 * process the csv
 */
router.post('/upload', async function (req, res, next) {

    try {
        const form = await extractfileFromForm(req);
        console.log(form);
    
        const appName = form.appName;
        const descritption = form.appDesc;
        const runtime = form.appRuntime; 
        const apis = await parsefile(form.apiFile)
    
        let files = [];
    
        apis.forEach(api => {
            const fileName = api.handler.split('.')[0];
    
            if(!files.includes(fileName))
            {
                files.push(fileName);
            }
        })
    
        let template = buildTemplate(apis, appName, descritption, runtime)
    
        await createFiles(files, appName);
    
        await fillApifiles(apis, appName);

        await writeFile(appName, 'template.yml', template, []);

        let str = "{\n" +
        "    \"name\": \"{{1}}\",\n" +
        "    \"description\": \"{{2}}\",\n" +
        "    \"version\": \"0.0.1\",\n" +
        "    \"private\": true,\n" +
        "    \"dependencies\": {\n" +
        "        \"aws-sdk\": \"^2.437.0\"\n" +
        "    }\n" +
        "}\n";
        
        await writeFile(appName, 'package.json', str, [appName, descritption]);


        const z = zip(appName);

        res.writeHead(200, {
            "Content-Disposition": "attachment;filename=" + appName +'.zip',
            'Content-Type': 'application/zip'
        });

        res.write(z);

        res.end();

    
    }
    catch (e)
    {
        console.log(e);
        res.status(500);
        res.json(e);
    }
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

function zip (path)
{
    var zip = new AdmZip();
    zip.addLocalFolder('tmp/' + path);
    const buffer =  zip.toBuffer();
    return buffer.toString('base64');
}

async function writeFile(path, fileName, template, values)
{
    let str = template;
    for (const [text, idx] in values)
    {
        let find = "{{" + idx + "}}";
        const regex = new RegExp(find, 'g');
        str = str.replace(regex, text);
    }
    const filePath = 'tmp/' + path  + '/' + fileName;
    await fsPromises.writeFile(filePath, str);
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

async function createFiles(files, projectName)
{
    const path = 'tmp/' + projectName + '/src/handler/';
    await fsPromises.mkdir(path, { recursive: true });

    for(const file of files)
    {
        const filePath = path  + file + '.js';
        console.log(filePath);
        await fsPromises.writeFile(filePath, '');
    }
}

async function fillApifiles(apis, projectName)
{
    for(const api of apis)
    {
        const splits = api.handler.split('.');
        const filename = splits[0] + '.js';
        const path = 'tmp/' + projectName + '/src/handler/' + filename;
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