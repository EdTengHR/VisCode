// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getData, postData } from './utils/NetworkRequests';
import { getWebviewContent } from './utils/ManageWebviewContent';

let style: vscode.TextEditorDecorationType;	// The code window decoration style
let panel: vscode.WebviewPanel | undefined = undefined;  // The WebView Panel

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(
		vscode.commands.registerCommand('viscode.start', async () => {			
			let serverType;				// '/py' if the code file is python, decides which path to send code to
			let serverUrl = 'fyp.rkds.xyz';
			let getServerUrl = 'https://fyp.rkds.xyz'
			let testType = 'response';		// set to null / response for default response
			let highlightColor = '#6272a4';
			let textColor = 'White';

			if (panel){
				panel.reveal();
			}
			else {
				panel = vscode.window.createWebviewPanel(
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
				const activeEditor = vscode.window.activeTextEditor		// get current editor's reference
				const activeEditorFilePath = activeEditor!?.document.uri.fsPath;
				const activeEditorFileName = path.basename(activeEditor!?.document.fileName);
				const testTxt = fs.readFileSync(activeEditorFilePath).toString();
	
				// string encoding to URL encoding, to be sent to server to do trace pathing 
				const asciiTxt = encodeURIComponent(testTxt);
				console.log('filename: ', activeEditorFileName);
	
				// identify file type, send to corresponding server
				serverType = 
					(activeEditorFileName.includes('.java')) ? '/java' : 
					(activeEditorFileName.includes('.py')) ? '/python' : 'unknown';
	
				if (serverType == 'unknown') {
					vscode.window.showErrorMessage("VisCode Extension Error: Visualization is only supported for Python and Java");
					panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 
						'error', 'Visualization is only supported for Python and Java');
				}
				else {
					console.log('server =', serverType);
					// Loading screen
					panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 'loading', '');
	
					// Error screen testing
					// panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 'error', '');
	
					postData(asciiTxt, activeEditorFileName, serverUrl, serverType, testType, panel, context);
					// getData(asciiTxt, getServerUrl, serverType, testType, panel, context);
				}			
				
				panel.webview.onDidReceiveMessage(
					message => {
						switch (message.command) {
							case 'DownloadVisualization':
								try {
									let dirPath = activeEditorFilePath.replace(activeEditorFileName, "")
									let vis = panel!.webview.html
									fs.writeFile(dirPath + 'visualization.html', vis, (err) => {
										if (err) {
											vscode.window.showErrorMessage("Visualization failed to download")
											throw err;
										}
									});
								}
								catch (err){
									throw err;
								}
								vscode.window.showInformationMessage("Visualization has been saved as visualization.html")
								return;
							case 'lineNumberChanged':
								if (style !== undefined){
									style.dispose();		// Remove current highlights in editor
								}
								style = vscode.window.createTextEditorDecorationType({
									backgroundColor: highlightColor, color: textColor
								});
	
								vscode.window.showTextDocument(vscode.Uri.file(activeEditorFilePath), 
										{ preview: false, viewColumn: vscode.ViewColumn.One});
	
								if (activeEditor){
									let lineNumber = message.text;
									let startLine = activeEditor.document.lineAt(lineNumber);
									let ranges: vscode.Range[] = [];
									ranges.push(startLine.range);
									activeEditor.setDecorations(style, ranges);
								}
								else {
									console.log("Active editor is undefined, potentially because " + 
											"calling webview panel changes it to undef")
								}
								return;
						}
					},
					undefined,
					context.subscriptions
				);
	
				panel.onDidDispose(
					() => {
						// The webview panel has been closed
						panel = undefined;
						deactivate();
					},
					null,
					context.subscriptions
				);
			}
		}),
	);
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('VisCode is now active!');
}

export function deactivate() {
	// Remove the text highlighting when the plugin is terminated
	if (style !== undefined){
		style.dispose();
	}

	return undefined;
}