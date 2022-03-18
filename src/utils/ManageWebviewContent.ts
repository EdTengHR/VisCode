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
		case 'loading': {
			return `
			<!DOCTYPE html>
			<html>
				<head>
					<style>
						#loading_screen {
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						z-index: 1000;
						}
						#message {
							display: block;
							top: 60%;
							position: relative;
							text-align: center;
							font-size: 200%;
						}
						#loader {
							display: block;
							position: relative;
							left: 50%;
							top: 35%;
							width: 150px;
							height: 150px;
              				margin: -75px 0 0 -75px;
							border-radius: 50%;
							border: 3px solid transparent;
							border-top-color: #3498db;
							animation: spin 2s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
						}

							#loader:before {
								content: "";
								position: absolute;
								top: 5px;
								left: 5px;
								right: 5px;
								bottom: 5px;
								border-radius: 50%;
								border: 3px solid transparent;
								border-top-color: #e74c3c;
								animation: spin 3s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
							}

							#loader:after {
								content: "";
								position: absolute;
								top: 15px;
								left: 15px;
								right: 15px;
								bottom: 15px;
								border-radius: 50%;
								border: 3px solid transparent;
								border-top-color: #f9c922;
								animation: spin 1.5s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
							}
							@keyframes spin {
								0%   { 
									transform: rotate(0deg);  /* Firefox 16+, IE 10+, Opera */
								}
								100% {
									transform: rotate(360deg);  /* Firefox 16+, IE 10+, Opera */
								}
							}
					</style>
				</head>
				<body>
					<div id = "loading_screen">
						<div id = "message">
							<b>
								Please wait while your visualization loads...
							</b>
						</div>
						<div id = "loader"></div>
					</div>
				</body>
			</html>
			`
		}
		case 'error': {
			return `
			<!DOCTYPE html>
			<html>
				<head>
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				
					<style nonce="${nonce}">					
					html {
						height: 100%;
					}
					
					body{
						font-family: 'Lato', sans-serif;
						color: #888;
						margin: 0;
					}
					
					#main{
						display: table;
						width: 100%;
						height: 100vh;
						text-align: center;
					}
					
					.fof{
						  display: table-cell;
						  vertical-align: middle;
					}
					
					.fof h1{
						  font-size: 50px;
						  display: inline-block;
						  padding-right: 12px;
					}
					</style>
				</head>
				<body>
					<div id="main">
						<div class="fof">
							<h1> An unexpected error has occurred </h1>
							<h3> Please try again at a later time </h3>
							<h3> Error message: ${data} </h3>
						</div>
					</div>
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