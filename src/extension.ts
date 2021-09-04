// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from 'fs';
import { stringify } from 'querystring';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const panel = vscode.window.createWebviewPanel(
		'viscode',		// Identifies type of the webview. USed internally
		'VisCode Visualizer',		// Title of the panel displayed to the user
		vscode.ViewColumn.Two,	// Editor column to show the new webview panel in
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}	// Webview options
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('viscode.start', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

			// Set HTML content
			panel.webview.html = getWebviewContent('basic');
			// Read file content and convert it to string
			var fs = require("fs");
			var vscode = require("vscode");
			var path = require("path");
			var serverType;

			// vscode.window.activeTextEditor gets editor's reference and 
			// document.uri.fsPath returns the path to that file in string format
			
			// TBD - may have to deal with when types are undefined (user's active window is probably 
			// the welcome screen or sth, if so remove '?' and handle accordingly)
			var currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
			var currentlyOpenTabfileName = path.basename(vscode.window.activeTextEditor?.document.fileName);
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

			// the response from the server goes into var txt, currently just a template
			var txt = '{"code":"public class Test { public static void main(String[] args) { int x = 3; x += x; int y = 23; int z = y + x;} }","stdin":"","trace":[{"stdout":"","event":"call","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{},"ordered_varnames":[],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"1","frame_id":1}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}},{"stdout":"","event":"step_line","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{},"ordered_varnames":[],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"2","frame_id":2}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}},{"stdout":"","event":"step_line","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{"x":3},"ordered_varnames":["x"],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"4","frame_id":4}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}},{"stdout":"","event":"step_line","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{"x":6},"ordered_varnames":["x"],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"8","frame_id":8}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}},{"stdout":"","event":"step_line","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{"x":6,"y":23},"ordered_varnames":["x","y"],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"10","frame_id":10}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}},{"stdout":"","event":"step_line","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{"x":6,"y":23,"z":29},"ordered_varnames":["x","y","z"],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"14","frame_id":14}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}},{"stdout":"","event":"return","line":1,"stack_to_render":[{"func_name":"main:1","encoded_locals":{"x":6,"y":23,"z":29,"__return__":["VOID"]},"ordered_varnames":["x","y","z","__return__"],"parent_frame_id_list":[],"is_highlighted":true,"is_zombie":false,"is_parent":false,"unique_hash":"15","frame_id":15}],"globals":{},"ordered_globals":[],"func_name":"main","heap":{}}],"userlog":"Debugger VM maxMemory: 485M\n"}';
			txt = txt.replace('\n', '');

			const obj = JSON.parse(txt);
			console.log(obj.trace[0].stack_to_render[0]);
		}),
	);
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VisCode" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('VisCode Extension deactivated');
}


function getWebviewContent(selection: string) {
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
		default: 
			return `<html></html>`
	}
}