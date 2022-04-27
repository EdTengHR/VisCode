import * as vscode from 'vscode';
import * as https from 'https';
import { getWebviewContent } from "./ManageWebviewContent";

// POST request Implementation
export function postData(encodedTxt: string, encodedInput:string, fileName: string, 
    serverUrl: string, serverType: string, testType: string, panel: vscode.WebviewPanel, 
    context: vscode.ExtensionContext){
    
    let stackTraceEndpoint = '/stacktrace';
    let nodeJsonEndpoint = '/nodejson';
    let extensionEndpoint = '/extension';

    let fileNameEncoded = encodeURIComponent(fileName)
    const postData = 'source=' + encodedTxt + '&' + 
                        'stdin=' + encodedInput + '&' +
                        'filename=' + fileNameEncoded;
    
    let serverPath =serverType + extensionEndpoint;

    console.log(postData);
    let data = '';		// the response data
    let output = '';
    const options = {
        host: serverUrl,
        port: 443,
        path: serverPath,
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
        body: postData
    };

    console.log(JSON.stringify(options))

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";  // Disable certificate verification

    const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
            data += chunk;
            output += chunk;
        });
        res.on('end', () => {
            console.log('No more data in response.');
            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, testType, data);
        });
    });
        
    req.on('error', (e) => {
        panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 'error', e.message);
        console.error(`problem with request: ${e.message}`);
    });
        
    // Write data to request body
    req.write(postData);
    req.end();
    console.log(data)
}

// POST Request for downloading visualization
export function DownloadVisualization(encodedTxt: string, encodedInput:string, fileName: string, 
    serverUrl: string, serverType: string){
    
    return new Promise((resolve, reject) => {
        let browserEndpoint = '/browser';

        let fileNameEncoded = encodeURIComponent(fileName)
        const postData = 'source=' + encodedTxt + '&' + 
                            'stdin=' + encodedInput + '&' +
                            'filename=' + fileNameEncoded;
        
        let serverPath =serverType + browserEndpoint;

        console.log(postData);
        let data = '';		// the response data
        let output = '';
        const options = {
            host: serverUrl,
            port: 443,
            path: serverPath,
            method: 'POST',
            headers: {
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
            body: postData
        };

        console.log(JSON.stringify(options))

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";  // Disable certificate verification

        const req = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
                data += chunk;
            });
            res.on('end', () => {
                console.log('No more data in response.');
                console.log(typeof data)
                resolve(data);
            });
        });
            
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });
            
        // Write data to request body
        req.write(postData);
        req.end();
    })
}

export async function download(encodedTxt: string, encodedInput:string, fileName: string, 
    serverUrl: string, serverType: string){
    
    return await DownloadVisualization(encodedTxt, encodedInput, fileName, 
        serverUrl, serverType);
}

// GET Request - extracting html from the webpage
export function getData(asciiTxt: string, fileName: string, serverUrl: string, serverType: string, 
    testType: string, panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {

    let testServer = '/test'
    let data = '';		// the response data

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";  // Disable certificate verification

    https.get(serverUrl + testServer, function(res) {
        console.log("Got response: " + res.statusCode);
        // console.log('headers:', res.headers)
        
        res.on("data", function(chunk) {
            // console.log("BODY: " + chunk);
            data += chunk;
            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, testType, data);
        });
    }).on('error', function(e) {
        console.error(`problem with request: ${e.message}`);
    });		

    return data;
}
