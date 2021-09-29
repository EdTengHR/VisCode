// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { setFlagsFromString } from 'v8';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(
		vscode.commands.registerCommand('viscode.start', async () => {			
			const panel = vscode.window.createWebviewPanel(
				'viscode',		// Identifies type of the webview. USed internally
				'VisCode Visualizer',		// Title of the panel displayed to the user
				vscode.ViewColumn.Two,	// Editor column to show the new webview panel in
				{
					enableScripts: true,
					retainContextWhenHidden: true,
				}	// Webview options
			);

			// Set HTML content
			panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 'react-test', '');

			var serverType;
			var serverUrl = 'fyp.rkds.xyz';

			// vscode.window.activeTextEditor gets editor's reference and 
			// document.uri.fsPath returns the path to that file in string format
			
			// TBD - may have to deal with when types are undefined (user's active window is probably 
			// the welcome screen or sth, if so remove '?' and handle accordingly)
			var currentlyOpenTabfilePath = vscode.window.activeTextEditor!?.document.uri.fsPath;
			var currentlyOpenTabfileName = path.basename(vscode.window.activeTextEditor!?.document.fileName);
			const testTxt = fs.readFileSync(currentlyOpenTabfilePath).toString();

			// string encoding to URL encoding, to be sent to server to do trace pathing 
			const asciiTxt = encodeURI(testTxt);
			console.log(asciiTxt);
			console.log('filename: ', currentlyOpenTabfileName);

			// identify file type, send to corresponding server
			serverType = 
				(currentlyOpenTabfileName.includes('.js')) ? 'javascript' : 
				(currentlyOpenTabfileName.includes('.py')) ? 'python' : 'unknown';

			// TODO - send the asciiTxt to server by appending it in data in server url
			if (serverType == 'unknown') 
				console.log('text type unknown, ask user to choose which server to send to?');
			else 
				console.log('server =', serverType);

			/*
			// POST request Implementation
			const postData = JSON.stringify(asciiTxt);
			var data = '';		// the response data
			const options = {
				hostname: serverUrl,
				port: 8000,
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
					panel.webview.html = getWebviewContent('response', data);
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
			*/

			/*
			// GET Request - testing to see if I can extract html from the webpage
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
					panel.webview.html = getWebviewContent('response',  data);
				});
			}).on('error', function(e) {
				console.log("Got error: " + e.message);
			});		
			*/
		}),
	);
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VisCode" is now active!');
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, selection: string, data: string) {
	// for testing purposes, should replace App.js file later on
	const scriptTestPathOnDisk = vscode.Uri.joinPath(extensionUri, 'src', 'App.js');
	// And the uri we use to load this script in the webview
	const scriptTestUri = (scriptTestPathOnDisk).with({ 'scheme': 'vscode-resource' });
	// Local path to css styles, replace with correct App.css later
	const stylesPathTestPath = vscode.Uri.joinPath(extensionUri, 'src', 'App.css');
	// Uri to load styles into webview
	const stylesTestUri = webview.asWebviewUri(stylesPathTestPath);
	
	const scriptReactTestPathOnDisk = vscode.Uri.joinPath(extensionUri, 'src', 'react-app.js');
	const scriptReactTestUri = (scriptReactTestPathOnDisk).with({ 'scheme': 'vscode-resource' });
	const stylesPathReactTestPath = vscode.Uri.joinPath(extensionUri, 'src/css', 'geek-base.css');
	const stylesReactTestUri = webview.asWebviewUri(stylesPathReactTestPath);

	const nonce = getNonce();
	
	switch (selection){
		case 'react-test': {
			return `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8"/>    
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Fullstack React - Become a JavaScript Fullstack Web Developer </title>
					<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
					<link href="${stylesReactTestUri}" rel="stylesheet">
				</head>
			<body> 
				<h1>Hello.</h1>
				<div id="app"></div>
				<script nonce="${nonce}" src="${scriptReactTestUri}"></script>
			</body>
			</html>
			`
		}
		case 'test': {
			return `
			<!DOCTYPE html><head>
				<meta http-equiv="content-type" content="text/html; charset=UTF-8">
				<title></title>
				<meta http-equiv="content-type" content="text/html; charset=UTF-8">
				<meta name="robots" content="noindex, nofollow">
				<meta name="googlebot" content="noindex, nofollow">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesTestUri}" rel="stylesheet">
			</head>
			<body>
				<div id="activities" class="info_container">
					<h1>Our Activities</h1>
					<div class="contain">
						<ul> 
							<li>Activity 1</li>
							<li>Activity 2</li>
							<li>Activity 3 </li>
							<li>Activity 4 </li>
							<li>Activity 5</li>
							<li>Activity 6 </li>
							<li>Activity 7</li>
							<li>Your Suggestions</li>
						</ul>
						<p>
							Bacon ipsum dolor sit amet ribeye tenderloin meatball, chuck andouille beef ribs jerky
							bresaola beef. Rump flank chicken meatloaf tail sirloin salami cow filet mignon ribeye 
							jerky swine pork loin turkey. Kielbasa pastrami shankle hamburger cow capicola venison 
							meatball turkey pancetta tongue doner porchetta. Ground round turducken flank jowl. 
							Sausage ham hock ham leberkas tri-tip. Brisket short loin cow leberkas kielbasa boudin
							meatball. Ribeye t-bone sirloin doner.
						</p>
						<div id="suggestion_input">
							<label for="name" >Your Name</label>
							<input type="text" id="name" name="name">
							<label for="email">Email</label>
							<input type="email" id="email" name="email">
							<label for="suggestions">Suggestions</label>
							<textarea id="suggestions" name="suggestions" rows="39"></textarea>
						</div>
						
					</div>
				</div>
				<script nonce="${nonce}" src="${scriptTestUri}"></script>
			</body>
			`
		}
		case 'response': {
			return `${data}`;
		}
		default: 
			return `<html></html>`
	}
}