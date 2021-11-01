import * as vscode from 'vscode';

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

	const nonce = getNonce();
	
	switch (selection){
		case 'response': {
			return `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8"/>    
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
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
		case 'test': {
			return `
			<!DOCTYPE html><head>
				<meta http-equiv="content-type" content="text/html; charset=UTF-8">
				<title></title>
				<meta http-equiv="content-type" content="text/html; charset=UTF-8">
				<meta name="robots" content="noindex, nofollow">
				<meta name="googlebot" content="noindex, nofollow">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesTestUri}" rel="stylesheet">
			</head>
			<body>
				<div id="activities" class="info_container">
					<h1>Our Activities</h1>
					<div class="contain">
						<ul> 
							<li>Activity 1</li>
							<li>Activity 2</li>
							<li>Activity 3 </li>
							<li>Activity 4 </li>
							<li>Activity 5</li>
							<li>Activity 6 </li>
							<li>Activity 7</li>
							<li>Your Suggestions</li>
						</ul>
						<p>
							Bacon ipsum dolor sit amet ribeye tenderloin meatball, chuck andouille beef ribs jerky
							bresaola beef. Rump flank chicken meatloaf tail sirloin salami cow filet mignon ribeye 
							jerky swine pork loin turkey. Kielbasa pastrami shankle hamburger cow capicola venison 
							meatball turkey pancetta tongue doner porchetta. Ground round turducken flank jowl. 
							Sausage ham hock ham leberkas tri-tip. Brisket short loin cow leberkas kielbasa boudin
							meatball. Ribeye t-bone sirloin doner.
						</p>
						<div id="suggestion_input">
							<label for="name" >Your Name</label>
							<input type="text" id="name" name="name">
							<label for="email">Email</label>
							<input type="email" id="email" name="email">
							<label for="suggestions">Suggestions</label>
							<textarea id="suggestions" name="suggestions" rows="39"></textarea>
						</div>
						
					</div>
				</div>
				<script nonce="${nonce}" src="${scriptTestUri}"></script>
			</body>
			`
		}
		default: 
			return `<html></html>`
	}
}