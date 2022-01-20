import * as vscode from 'vscode';
import * as https from 'https';
import { getWebviewContent } from "./ManageWebviewContent";

// POST request Implementation
export function postData(asciiTxt: string, serverUrl: string, serverType: string, testType: string, panel: vscode.WebviewPanel, 
        context: vscode.ExtensionContext) {
    
    var serverPort, testServer = '/test';
    if (serverType == '/python')
        serverPort = 35001;
    else if (serverType == '/javascript')
        serverPort = 35000;
    else
        serverPort = 16000;     // used for testing purposes, temporarily does nothing

    const postData = 'source=' + asciiTxt;
    console.log(postData);
    var data = '';		// the response data
    const options = {
        hostname: serverUrl,
        port: 443,
        path: serverType,
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
        body: {
            'source': postData
        }
    };

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";  // Disable certificate verification

    const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, testType, data);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });
        
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
        
        // Write data to request body
    req.write(postData);
    req.end();
}


// GET Request - extracting html from the webpage
export function getData(asciiTxt: string, serverUrl: string, serverType: string, testType: string, panel: vscode.WebviewPanel, 
    context: vscode.ExtensionContext) {

    var testServer = '/test'
    var data = '';		// the response data

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";  // Disable certificate verification

    https.get(serverUrl + testServer, function(res) {
        console.log("Got response: " + res.statusCode);
        console.log('headers:', res.headers)
        
        res.on("data", function(chunk) {
            console.log("BODY: " + chunk);
            data += chunk;
            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, testType, data);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });		
}
