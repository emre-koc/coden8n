import axios from 'axios';
import * as vscode from 'vscode';

function getConfiguration() {
  const configuration = vscode.workspace.getConfiguration('n8n');
  return {
    baseURL: configuration.get('baseURL', 'https://your-n8n-instance.com/api/v1'),
    apiKey: configuration.get('apiKey', ''),
  };
}

const config = getConfiguration();
const n8nInstance = axios.create({
  baseURL: config.baseURL,
  timeout: 1000,
  headers: {
    'Authorization': `Bearer ${config.apiKey}`
  }
});

export async function authenticate() {
  // This function might not be needed if the API key is always included in headers
}
 
export async function getWorkflows() {
  const response = await n8nInstance.get('/workflows');
  return response.data;
}

export async function getCodeNodes(workflowId: string) {
  const response = await n8nInstance.get(`/workflows/${workflowId}`);
  return response.data.nodes.filter((node: { type: string; }) => node.type === 'n8n-nodes-base.code');
}

export async function getNode(nodeId: string) {
  const response = await n8nInstance.get(`/nodes/${nodeId}`);
  return response.data;
}

export async function updateNode(nodeId: string, parameters: any) {
  await n8nInstance.patch(`/nodes/${nodeId}`, { parameters });
}