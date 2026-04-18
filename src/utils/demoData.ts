import { v4 as uuidv4 } from 'uuid';
import { Snippet } from '../types';

export const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: uuidv4(),
    title: '🚀 Welcome to SnippetBox Pro',
    tags: ['welcome', 'guide', 'mastery'],
    isFavorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'Guide.md',
        language: 'markdown',
        code: `# 📦 Premium Snippet Management

You are now using a high-performance, local-first code manager.

### 🛠 Showcase Features:
1. **Multi-file Support**: Look at the "Glassmorphism Card" snippet below.
2. **Universal Syntax**: We support Rust, Go, Python, Docker, and 20+ more.
3. **Template Engine**: Use '{{variable}}' to create reusable templates.
4. **Instant Search**: Press **Cmd+K** (or your custom shortcut) to find anything.

### ⚡ Shortcuts:
- **Cmd+N**: New Snippet
- **Cmd+Shift+F**: Global Toggle
- **Cmd+Enter**: Save & Close

*Your data is stored in a local SQLite database with WAL optimization for maximum speed.*`
      }
    ]
  },
  {
    id: uuidv4(),
    title: '✨ Glassmorphism Card Component',
    tags: ['ui', 'frontend', 'css-modules'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'Card.html',
        language: 'html',
        code: `<div class="glass-card">
  <h2>SnippetBox</h2>
  <p>Local-first performance.</p>
  <button id="action-btn">Explore</button>
</div>`
      },
      {
        id: uuidv4(),
        filename: 'Card.css',
        language: 'css',
        code: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  transition: transform 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
}`
      },
      {
        id: uuidv4(),
        filename: 'Card.js',
        language: 'javascript',
        code: `document.getElementById('action-btn').addEventListener('click', () => {
  console.log('Action triggered!');
  alert('Welcome to the future of snippets!');
});`
      }
    ]
  },
  {
    id: uuidv4(),
    title: '🦀 Rust Concurrent Worker',
    tags: ['rust', 'backend', 'performance'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'main.rs',
        language: 'rust',
        code: `use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();
}`
      }
    ]
  },
  {
    id: uuidv4(),
    title: '🐳 Docker Microservice Stack',
    tags: ['devops', 'docker', 'infrastructure'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'Dockerfile',
        language: 'dockerfile',
        code: `FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`
      },
      {
        id: uuidv4(),
        filename: 'docker-compose.yml',
        language: 'yaml',
        code: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/snippets
  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:`
      }
    ]
  },
  {
    id: uuidv4(),
    title: '⚛️ React Global Store Template',
    tags: ['react', 'zustand', 'template'],
    isTemplate: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'use{{StoreName}}.ts',
        language: 'typescript',
        code: `import { create } from 'zustand';

interface {{StoreName}}State {
  items: any[];
  isLoading: boolean;
  addItem: (item: any) => void;
}

export const use{{StoreName}} = create<{{StoreName}}State>((set) => ({
  items: [],
  isLoading: false,
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));`
      }
    ]
  },
  {
    id: uuidv4(),
    title: '🐍 Python File Processor',
    tags: ['python', 'automation', 'utility'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'process.py',
        language: 'python',
        code: `import os
import shutil

def organize_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            dest = os.path.join(directory, "text_files")
            os.makedirs(dest, exist_ok=True)
            shutil.move(os.path.join(directory, filename), dest)
            print(f"Moved {filename} to {dest}")

if __name__ == "__main__":
    organize_files("./downloads")`
      }
    ]
  },
  {
    id: uuidv4(),
    title: '📜 SnippetBox Version History',
    tags: ['meta', 'changelog', 'updates'],
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [
      {
        id: uuidv4(),
        filename: 'CHANGELOG.md',
        language: 'markdown',
        code: `# 📔 Evolution of SnippetBox

A record of the journey towards the ultimate snippet manager.

### 🚀 v1.5.1 — "The Speed Demon" (Current)
- **Extreme Optimization**: Transitioned to SQLite **WAL mode** and implemented **O(1) data mapping**.
- **UX Polish**: Added search debouncing (150ms) to ensure smooth typing.
- **Bulk Mastery**: Atomic transactions for mass operations.

### 🎨 v1.4.0 — "Brand & Identity"
- **New Visuals**: Modern 2D minimalist logo & custom macOS Dock icon.
- **System Integration**: Native macOS Menu Bar icon with theme-aware template support.
- **Polyglot Phase**: Support for Go, Rust, Swift, Kotlin, and 20+ other technologies.

### 🏗️ v1.2.0 — "The SQL Era"
- **Migration**: Moved from JSON storage to persistent **SQLite**.
- **Instant Find**: Implemented **FTS5** (Full-Text Search) for rapid lookups.

### 📦 v1.0.0 — "Initial Release"
- Core CRUD functionality.
- Basic syntax highlighting via CodeMirror.
- Tagging and multi-file support.

---
*Built with React, Tauri, and a lot of caffeine.*`
      }
    ]
  }
];
