// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { download, DownloadVisualization, getData, postData } from './utils/NetworkRequests';
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
			let serverType = '';				// '/py' if the code file is python, decides which path to send code to
			let serverUrl = 'fyp.rkds.xyz';
			let getServerUrl = 'https://fyp.rkds.xyz'
			let testType = 'response';		// set to null / response for default response
			let highlightColor = '#6272a4';
			let textColor = 'White';
			let inputList = null;
			let userInputs = '';
	
			// vscode.window.activeTextEditor gets editor's reference and 
			// document.uri.fsPath returns the path to that file in string format
			
			// To deal with when types are undefined (e.g. user's active window is  
			// the welcome screen, remove '?' and handle accordingly)
			const activeEditor = vscode.window.activeTextEditor		// get current editor's reference
			const activeEditorFilePath = activeEditor!?.document.uri.fsPath;
			const activeEditorFileName = path.basename(activeEditor!?.document.fileName);
			const inputCode = fs.readFileSync(activeEditorFilePath).toString();

			// Remove all commented code from input file
			let processedCode = encodeURIComponent(inputCode).replace(/%23(.*?)%0A/gm, "");
			let urlEncodedCode = encodeURIComponent(inputCode);

			if (processedCode.includes("input") || processedCode.includes("System.in")){
				inputList = await vscode.window.showInputBox({
					title: 'We have detected that your program uses user inputs.',
					prompt: 'Please enter the inputs, separated by "\\\\n", in the input box',
					placeHolder: 'Enter your inputs here',
				});
	
				if (inputList !== undefined){
					let encodedInput = encodeURIComponent(inputList);
					userInputs = encodedInput.replace(/\%5C\%5Cn/g, "%0a");
					console.log(userInputs);					
					vscode.window.showInformationMessage(`Inputs submitted to the server: ${inputList}`);
				}
			}
			
			if (panel){
				if (style !== undefined){
					style.dispose();
				}
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
			}

			// string encoding to URL encoding, to be sent to server to do trace pathing 
			const encodedTxt = urlEncodedCode;
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
			// No inputs / input was cancelled
			else if (inputList === undefined){
				vscode.window.showErrorMessage("Error: Your program requires an input file");
				panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 
					'error', 'Inputs are required to run your program, ' + 
					'please enter your inputs in a separate .txt file, and type in the file name ' + 
					'in the input box that is launched when the visualize command is called');
			}
			else {
				console.log('server =', serverType);
				// Loading screen
				panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, 'loading', '');

				postData(encodedTxt, userInputs, activeEditorFileName, serverUrl, serverType, testType, panel, context);
				// getData(asciiTxt, getServerUrl, serverType, testType, panel, context);
			}	
			
			// Remove all line highlights when the text document was changed
			vscode.workspace.onDidChangeTextDocument(function (e){
				console.log('Text document was changed')
				if (style !== undefined){
					style.dispose();
				}
			})
			
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'DownloadVisualization':
							try {
								let dirPath = activeEditorFilePath.replace(activeEditorFileName, "")
								let vis = download(encodedTxt, userInputs, activeEditorFileName, serverUrl, serverType);
								vis.then((data) => {
									if (typeof data === "string"){
										fs.writeFile(dirPath + 'visualization.html', data, (err) => {
											if (err) {
												vscode.window.showErrorMessage("Visualization failed to download")
												throw err;
											}
										});
									}
									else {
										vscode.window.showErrorMessage("Visualization failed to download")
									}
								}).catch((err) => console.log(err));
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
								if (lineNumber >= 0){
									let startLine = activeEditor.document.lineAt(lineNumber);
									let ranges: vscode.Range[] = [];
									ranges.push(startLine.range);
									activeEditor.setDecorations(style, ranges);
								}
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
		}),
	);
	console.log('VisCode is now active!');
}

export function deactivate() {
	// Remove the text highlighting when the plugin is terminated
	if (style !== undefined){
		style.dispose();
	}

	return undefined;
}