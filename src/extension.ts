// Notes
// palette - Use the commands-section in package.json to make a command show in the command palette.
// keybinding - Use the keybindings-section in package.json to enable keybindings for your extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
			vscode.window
			.showInformationMessage('VisCode Visualizer', ...['Prev', 'Next'])
			.then(selection => {
				console.log(selection);
				(selection! == 'Next') ? vscode.commands.executeCommand('viscode.next') : 
				vscode.commands.executeCommand('viscode.prev')
			});
		}),

		vscode.commands.registerCommand('viscode.next', () => {
			panel.webview.html = getWebviewContent('Next');
			vscode.window
			.showInformationMessage('VisCode Visualizer', ...['Prev', 'Next'])
			.then(selection => {
				console.log(selection);
				(selection! == 'Next') ? vscode.commands.executeCommand('viscode.next') : 
				vscode.commands.executeCommand('viscode.prev')
			});
		}),

		vscode.commands.registerCommand('viscode.prev', () => {
			panel.webview.html = getWebviewContent('Prev');
			vscode.window
			.showInformationMessage('VisCode Visualizer', ...['Prev', 'Next'])
			.then(selection => {
				console.log(selection);
				(selection! == 'Next') ? vscode.commands.executeCommand('viscode.next') : 
				vscode.commands.executeCommand('viscode.prev')
			});
		})
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
		case 'basic' || 'Prev': {
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
						<canvas id="myCanvas" style="border:1px solid #c3c3c3;">
						</canvas>
						<canvas id="circle" </canvas>

						<script>
						(function() {
							var
							// Obtain a reference to the canvas element using its id.
							htmlCanvas = document.getElementById('myCanvas'),
							circleCanvas = document.getElementById('circle'),
							// Obtain a graphics context on the canvas element for drawing.
							context = htmlCanvas.getContext('2d');
							circleContext = circleCanvas.getContext('2d');
					
							// Start listening to resize events and draw canvas.
							initialize();

							context.fillStyle = "#FF0000";
							context.fillRect = (0, 0, window.innerWidth, window.innerHeight);
					
							function initialize() {
								// Register an event listener to call the resizeCanvas() function 
								// each time the window is resized.
								window.addEventListener('resize', resizeCanvas, false);
								// Draw canvas border for the first time.
								resizeCanvas();
							}
					
							// Display custom canvas. In this case it's a blue, 5 pixel 
							// border that resizes along with the browser window.
							function redraw() {
								context.strokeStyle = 'blue';
								context.lineWidth = '5';
								context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
							
							}
					
							// Runs each time the DOM window resize event fires.
							// Resets the canvas dimensions to match window,
							// then draws the new borders accordingly.
							function resizeCanvas() {
								htmlCanvas.width = window.innerWidth;
								htmlCanvas.height = window.innerHeight;
								circleCanvas.width = window.innerWidth;
								circleCanvas.height = window.innerHeight;
								redraw();
							}
						})();


						</script>
					</body>
					</html>`;
		}
		case 'Next': {
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
						<canvas id="myCanvas" style="border:1px solid #c3c3c3;">
						</canvas>
						<canvas id="circle" </canvas>

						<script>
						(function() {
							var
							// Obtain a reference to the canvas element using its id.
							htmlCanvas = document.getElementById('myCanvas'),
							circleCanvas = document.getElementById('circle'),
							// Obtain a graphics context on the canvas element for drawing.
							context = htmlCanvas.getContext('2d');
							circleContext = circleCanvas.getContext('2d');
					
							// Start listening to resize events and draw canvas.
							initialize();

							context.fillStyle = "#FF0000";
							context.fillRect = (0, 0, window.innerWidth, window.innerHeight);
					
							function initialize() {
								// Register an event listener to call the resizeCanvas() function 
								// each time the window is resized.
								window.addEventListener('resize', resizeCanvas, false);
								// Draw canvas border for the first time.
								resizeCanvas();
							}
					
							// Display custom canvas. In this case it's a blue, 5 pixel 
							// border that resizes along with the browser window.
							function redraw() {
								context.strokeStyle = 'blue';
								context.lineWidth = '5';
								context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
								

								var X = circleCanvas.width/2;
								var Y = circleCanvas.height/2;
								var R = 45;
								circleContext.beginPath();
								circleContext.arc(X, Y, R, 0, 2 * Math.PI, false);
								circleContext.lineWidth = 5;
								circleContext.strokeStyle = '#FF0000';
								circleContext.stroke();
							}
					
							// Runs each time the DOM window resize event fires.
							// Resets the canvas dimensions to match window,
							// then draws the new borders accordingly.
							function resizeCanvas() {
								htmlCanvas.width = window.innerWidth;
								htmlCanvas.height = window.innerHeight;
								circleCanvas.width = window.innerWidth;
								circleCanvas.height = window.innerHeight;
								redraw();
							}
						})();


						</script>
					</body>
					</html>`;
		}
	}
	return `
	<html></html>`
}