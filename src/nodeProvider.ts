import * as vscode from 'vscode';
import { getWorkflows, getCodeNodes } from './n8nApi';

export class NodeProvider implements vscode.TreeDataProvider<NodeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<NodeItem | undefined | void> = new vscode.EventEmitter<NodeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<NodeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: NodeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: NodeItem): Promise<NodeItem[]> {
    if (!element) {
      const workflows = await getWorkflows();
      return workflows.map((workflow: { name: string; id: string; }) => new NodeItem(workflow.name, vscode.TreeItemCollapsibleState.Collapsed, workflow.id));
    } else {
      const nodes = await getCodeNodes(element.id);
      return nodes.map((node: { name: string; id: string; }) => new NodeItem(node.name, vscode.TreeItemCollapsibleState.None, node.id));
    }
  }
}

export class NodeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly id: string
  ) {
    super(label, collapsibleState);
  }
}