// Document Management System - TypeScript

interface Document {
  id: string;
  title: string;
  version: string;
  category: string;
  status: string;
  created: string;
  modified: string;
  author: string;
}

document.addEventListener('DOMContentLoaded', () => {
  // Handle HTMX responses
  document.body.addEventListener('htmx:afterSwap', (event: any) => {
    if (event.detail.target.id === 'document-list') {
      renderDocuments(event.detail.xhr.response);
    }
  });
});

function renderDocuments(response: any): void {
  const documents: Document[] = typeof response === 'string' 
    ? JSON.parse(response) 
    : response;
  
  const listElement = document.getElementById('document-list');
  if (!listElement) return;

  if (documents.length === 0) {
    listElement.innerHTML = '<p class="empty">No documents found</p>';
    return;
  }

  listElement.innerHTML = `
    <table class="document-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Version</th>
          <th>Category</th>
          <th>Status</th>
          <th>Modified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${documents.map(doc => `
          <tr>
            <td>${escapeHtml(doc.title)}</td>
            <td>${escapeHtml(doc.version)}</td>
            <td><span class="badge badge-${doc.category.toLowerCase()}">${escapeHtml(doc.category)}</span></td>
            <td><span class="badge badge-${doc.status.toLowerCase().replace(' ', '-')}">${escapeHtml(doc.status)}</span></td>
            <td>${escapeHtml(doc.modified)}</td>
            <td>
              <button class="btn btn-sm btn-danger" 
                      hx-delete="/api/documents/${doc.id}" 
                      hx-target="#document-list" 
                      hx-swap="outerHTML"
                      hx-confirm="Are you sure you want to delete this document?">
                Delete
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

