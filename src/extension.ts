// https://github.com/dannysteenman/vscode-cloudformation-snippets/blob/main/snippets/json-general.json

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pit" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pit.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ParachainsIntegrationTests!');
	});

  let loadChainSpecsOnOpen = vscode.workspace.onDidOpenTextDocument(loadChainsMetadata);
  let loadChainSpecsOnChange = vscode.workspace.onDidChangeTextDocument(e => loadChainsMetadata(e.document));

  let palletAndCallSuggestions = vscode.languages.registerCompletionItemProvider(
    'yaml', // This will make the provider work only for yaml files
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

      // Get the range from the start of the line to the current position
      const range = new vscode.Range(position.line, 0, position.line, position.character);

      // Get the text in this range
      const text = document.getText(range);

      // Split the text into words
      const words = text.split(/\s+/).filter(word => word !== '');

      // Get the last word
      const wordAfterIdentifier = words[words.length - 1];

      // Key identifier
      const identifier = words[0];

      let suggestions = undefined;

      // Only when we want to add a pallet or call
      if (identifier !== 'pallet:' && identifier !== 'call:') {
          return undefined;
      } else if (identifier === 'pallet:') {
        // Offer available pallets
        // Compute completion items based on the word before the cursor
        suggestions = computeCompletionItems(wordAfterIdentifier);
      } else if (identifier === 'call:') {
        // Look for the selected pallet and offer available calls
        // Compute completion items based on the word before the cursor
        suggestions = computeCompletionItems(wordAfterIdentifier);
      }

      return suggestions;
    }
    },
    ...'abcdefghijklmnopqrstuvwxyz'.split(''), // Trigger the provider whenever any letter is typed
    // '*', // Trigger the provider whenever '*' is typed
    // '$' // Trigger the provider whenever '$' is typed
    );

    context.subscriptions.push(disposable);
    context.subscriptions.push(loadChainSpecsOnOpen, loadChainSpecsOnChange);
    context.subscriptions.push(palletAndCallSuggestions);

    // If there is an active document when the extension is activated, parse it
    if (vscode.window.activeTextEditor) {
      loadChainsMetadata(vscode.window.activeTextEditor.document);
    }
}

function loadChainsMetadata(document: vscode.TextDocument) {
  if (document.languageId !== 'yaml') {
      return;
  }

  let text = document.getText();
  let regex = /(\w+):\s*&(\w+)\s*\n\s*wsPort:\s*(\d+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
      let chainName = match[1];
      let referenceName = match[2];
      let wsPortValue = match[3];

      vscode.window.showInformationMessage(`Found wsPort in chain '${chainName}' with reference '${referenceName}' and value '${wsPortValue}'`);
  }
}

function computeCompletionItems(wordBeforeCursor: string): vscode.CompletionItem[] {
  const item = new vscode.CompletionItem(`You typed '${wordBeforeCursor}'`, vscode.CompletionItemKind.Method);
  item.sortText = '!'; // This will sort before any string that doesn't start with a '0'
  return [item, item];
}

// This method is called when your extension is deactivated
export function deactivate() {}
