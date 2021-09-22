// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

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
			panel.webview.html = getWebviewContent('test', '');

			var serverType;
			var serverUrl = 'http://fyp.rkds.xyz';

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

			// var response = await fetch(serverUrl, {
			// 	method: 'POST',
			// 	headers: {
			// 		serverType
			// 	},
			// 	body: asciiTxt,
			// });

			// const options = {
			// 	hostname: serverUrl,
			// 	port: 8000,
			// 	path: '/test',
			// 	method: 'POST',
			// 	headers: {
			// 	  'Content-Type': 'application/json',
			// 	  'Content-Length': asciiTxt.length
			// 	}
			// }
			
			// const req = http.request(options, res => {
			// 	console.log(`statusCode: ${res.statusCode}`);
			// 	res.on('data', d => {
			// 		process.stdout.write(d);
			// 	})
			// })

			// const response = await fetch('https://github.com/');
			// const body = await response.text();

			// console.log(body);
		}),
	);
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VisCode" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(selection: string, data: string) {
	switch (selection){
		case 'basic': {
			return `
				<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">

						<style>
							html { height: 100%; width: 100%; padding: 0; margin: 0; }
							body { height: 100%; width: 100%; padding: 0; margin: 0; }
							iframe { height: 100%; width: 100%; padding: 0; margin: 0; border: 0; display: block; }
							canvas {position: absolute; top: 0; left: 0;}
						</style>

						<title>Visualizer</title>
					</head>
					<body>
						<iframe src="https://rkds.xyz" title="description"></iframe>
					</body>
					</html>`;
		}
		case 'test': {
			return `<!DOCTYPE html>
			<html>
			<body>
			
			<h2>My First JavaScript</h2>
			
			<button type="button"
			onclick="document.getElementById('demo').innerHTML = Date()">
			Click me to display Date and Time.</button>
			
			<p id="demo"></p>
			
			</body>
			</html> 
			`
		}
		case 'response': {
			return `${data}`;
		}
		default: 
			return `<html></html>`
	}
}