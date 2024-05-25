import * as vscode from 'vscode';
import { NodeProvider } from './nodeProvider';
import { getNode, updateNode } from './n8nApi';

export function activate(context: vscode.ExtensionContext) {
  const nodeProvider = new NodeProvider();
  context.subscriptions.push(vscode.window.registerTreeDataProvider('n8nNodes', nodeProvider));

  context.subscriptions.push(vscode.commands.registerCommand('n8nNodes.refresh', () => nodeProvider.refresh()));
  context.subscriptions.push(vscode.commands.registerCommand('n8nNodes.editNode', async (nodeId: string) => {
    const node = await getNode(nodeId);
    const document = await vscode.workspace.openTextDocument({ content: node.parameters.code, language: 'javascript' });
    await vscode.window.showTextDocument(document);

    vscode.workspace.onDidSaveTextDocument(async (doc) => {
      if (doc === document) {
        await updateNode(nodeId, { code: doc.getText() });
      }
    });
  }));

  // Command to open the settings UI directly
  context.subscriptions.push(vscode.commands.registerCommand('n8nNodes.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'n8n');
  }));


}

export function deactivate() {}