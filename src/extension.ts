// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as d3 from 'd3';
import { getData, postData } from './utils/NetworkRequests';
import { getWebviewContent } from "./utils/ManageWebviewContent"

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(
		vscode.commands.registerCommand('viscode.start', async () => {			
			var serverType;				// '/py' if the code file is python, decides which path to send code to
			var serverUrl = 'fyp.rkds.xyz';
			var testType = 'response';		// set to null / response for default response
			
			const panel = vscode.window.createWebviewPanel(
				'viscode',		// Identifies type of the webview. USed internally
				'VisCode Visualizer',		// Title of the panel displayed to the user
				vscode.ViewColumn.Two,	// Editor column to show the new webview panel in
				{
					enableScripts: true,
					retainContextWhenHidden: true,
				}	// Webview options
			);

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
				(currentlyOpenTabfileName.includes('.java')) ? '/java' : 
				(currentlyOpenTabfileName.includes('.py')) ? '/python' : 'unknown';

			if (serverType == 'unknown') 
				console.log('text type unknown, ask user to choose which server to send to?');
				// TODO - Error handling here
			else 
				console.log('server =', serverType);
			
			postData(asciiTxt, serverUrl, serverType, testType, panel, context);
			// getData(asciiTxt, serverUrl, serverType, testType, panel, context);
		}),
	);
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VisCode" is now active!');
}

export function deactivate() {}