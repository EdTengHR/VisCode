import * as vscode from 'vscode';
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

	const nonce = getNonce();
	
	switch (selection){
		case 'response': {
			return `
			${data}
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