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

	// D3 Force testing
	// https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03
	const d3ForcePath = 'D:/HKUST/Year 4/FYP/code/viscode/src/d3force/';
	const d3Style = fs.readFileSync(d3ForcePath + 'head-style.html');
	const d3Body = fs.readFileSync(d3ForcePath + 'body.html');
	const d3CodePath = vscode.Uri.joinPath(extensionUri, 'src', 'd3force', 'code.js');
	const d3CodeUri = (d3CodePath).with({ 'scheme': 'vscode-resource' });

	const nonce = getNonce();
	
	switch (selection){
		case 'response': {
			return `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8"/>    
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}' https:;">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title> VisCode visualization </title>
				</head>
				<body>
					<script nonce="${nonce}">
						${data}
					</script>
				</body>
			</html>
			`
		}
		case 'd3-force': {
			return `
			<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="Content-Security-Policy" content="default-src self; connect-src vscode-webview:; style-src vscode-webview: 'nonce-${nonce}'; img-src https:; script-src 'nonce-${nonce}' https: vscode-resource: 'self';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title> VisCode visualization </title>
				<style nonce="${nonce}">
					${d3Style}
				</style>
			</head>
			<body>
				${d3Body}
				<script nonce="${nonce}" src="https://d3js.org/d3.v7.min.js"></script>
				<script nonce="${nonce}" src="${d3CodeUri}"></script>
			</body>
			</html>
			`
		}
		case 'd3-test': {
			return `
			<!DOCTYPE html>
			<html>
				<head>
					<script nonce ="${nonce}" src="https://d3js.org/d3.v7.min.js"></script>
					<script nonce ="${nonce}" src="https://d3js.org/d3-force.v3.min.js"></script>
					<meta charset="utf-8"/>    
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}' https:;">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title> VisCode visualization </title>
				</head>
				<body>
					<script nonce="${nonce}" src="${scriptD3TestUri}"></script>
				</body>
			</html>
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
		case 'iframe': {
			return `
			<!DOCTYPE html>
			<html>
			<body>
				<form action="http://fyp.rkds.xyz:16002/py" method="post" target="myiframe" id="myform">
					<textarea name="source" hidden="">print('a')</textarea>
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