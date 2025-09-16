# Neodev

Neodev is a modern, interactive web-based code preview and editing platform. It allows users to explore, edit, and preview code projects in real-time, with a focus on a seamless developer experience and beautiful UI.

## Features

- **Live Code Preview:** Instantly preview your code changes in a secure iframe sandbox.
- **Tabbed Interface:** Switch between code and preview views with a simple, intuitive tab system.
- **File Explorer:** Browse and select files from your project structure.
- **Download as ZIP:** Download your entire project or selected files as a ZIP archive with one click.
- **Fullscreen Mode:** Expand the preview or code editor for distraction-free development.
- **Responsive Design:** Works beautifully on all screen sizes.
- **Modern UI Components:** Built with a custom UI library and Tailwind CSS for a clean, consistent look.

## Tech Stack

- **Next.js** (App Router)
- **React**
- **Tailwind CSS**
- **Zustand** (state management)
- **Lucide React** (icons)
- **@webcontainer/api** (for in-browser code execution and export)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/MD-Raiyaan/Neodev.git
   cd Neodev
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser:**
   Visit neodev to start using Neodev.

## Project Structure

- `app/` — Main Next.js app directory (pages, API routes, layout)
- `components/` — Reusable UI and feature components
- `hooks/` — Custom React hooks (e.g., Zustand store)
- `lib/` — Utility libraries and helper functions
- `utils/` — Constants and utility scripts

## Usage

- **Previewing Code:**
  - Select a file from the explorer to view its code or preview.
  - Use the tabs to switch between code and live preview.
- **Downloading Files:**
  - Click the download button in the header to export your project as a ZIP file.
- **Fullscreen Mode:**
  - Toggle fullscreen for a focused editing or preview experience.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, new features, or improvements.

## License

This project is licensed under the MIT License.

---

**Neodev** — Empowering developers with a beautiful, modern code preview experience.
