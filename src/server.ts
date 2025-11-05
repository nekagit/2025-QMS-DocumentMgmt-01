import express from 'express';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage (replace with database in production)
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

let documents: Document[] = [
  {
    id: '1',
    title: 'Quality Policy',
    version: '2.0',
    category: 'Policy',
    status: 'Approved',
    created: '2025-01-01',
    modified: '2025-01-15',
    author: 'John Doe'
  },
  {
    id: '2',
    title: 'Procedure Manual',
    version: '1.5',
    category: 'Procedure',
    status: 'Draft',
    created: '2025-01-10',
    modified: '2025-01-20',
    author: 'Jane Smith'
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/documents', (req, res) => {
  res.json(documents);
});

app.post('/api/documents', (req, res) => {
  const newDoc: Document = {
    id: Date.now().toString(),
    title: req.body.title,
    version: req.body.version || '1.0',
    category: req.body.category,
    status: req.body.status || 'Draft',
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
    author: req.body.author || 'System'
  };
  documents.push(newDoc);
  res.json(newDoc);
});

app.delete('/api/documents/:id', (req, res) => {
  documents = documents.filter(doc => doc.id !== req.params.id);
  res.json({ success: true });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (doc) {
    res.json(doc);
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Document Management System running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

