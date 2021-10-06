import * as vscode from 'vscode';
import * as http from 'http';
import { getWebviewContent } from "./ManageWebviewContent";

// POST request Implementation
export function postData(asciiTxt: string, serverUrl: string, testType: string, panel: vscode.WebviewPanel, 
        context: vscode.ExtensionContext) {

    const postData = JSON.stringify(asciiTxt);
    var data = '';		// the response data
    const options = {
        hostname: serverUrl,
        port: 16000,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
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
export function getData(asciiTxt: string, serverUrl: string, testType: string, panel: vscode.WebviewPanel, 
    context: vscode.ExtensionContext) {

    var data = '';		// the response data
    var options = {
        host: serverUrl,
        port: 8000,
        path: '/'
    };

    http.get(options, function(res) {
        console.log("Got response: " + res.statusCode);
        
        res.on("data", function(chunk) {
            console.log("BODY: " + chunk);
            data += chunk;
            panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, testType, data);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });		
}
