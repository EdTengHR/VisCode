import * as vscode from 'vscode';
import * as d3 from 'd3';
import * as fs from 'fs';

export function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, 
    selection: string='response', data: string) {


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
	
	const scriptD3TestPathOnDisk = vscode.Uri.joinPath(extensionUri, 'src', 'd3-test.js');
	const scriptD3TestUri = (scriptD3TestPathOnDisk).with({ 'scheme': 'vscode-resource' });

	const scriptD3Path = vscode.Uri.joinPath(extensionUri, 'node_modules', 'd3', 'src', 'index.js');
	const scriptD3Uri =  webview.asWebviewUri(scriptD3Path);
	
	const nonce = getNonce();
	
	switch (selection){
		case 'response': {
			return `
			${data}
			`
		}
		case 'ryder-test': {
			return `
			<!DOCTYPE html>
			<html>
			<head>
			<title>Request Tester</title>
			<script>
			function hello_there(){
				window.location.replace("http://fyp.rkds.xyz/py");
			}
			</script>
			</head>

			<body>
			<p>As per your request, I have included a button which runs some javascript code. Enjoy!</p>
			<button onclick="hello_there()">Click me</button>
			</body>

			</html>
			`
		}
		case 'iframe': {
			return `
			<!DOCTYPE html>
			<html>
			<body>
				<form action="http://fyp.rkds.xyz:16002/py" method="post" target="myiframe" id="myform">
					<textarea name="source" hidden="">print('a')\nprint('hello')\nprint('hi')</textarea>
				</form>
				<iframe src="about:blank" name="myiframe" width="100%" height="100%" frameBorder="0"></iframe>
				
				<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
				<script>
					$(window).on("load", function(e){
						document.getElementById("myform").submit();
					});
				</script>
			</body>
			</html>
			`
		}
		default: 
			return `<html></html>`
	}
}