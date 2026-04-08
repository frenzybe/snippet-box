<p align="center">
  <img src="src-tauri/icons/icon_source.png" width="128" height="128" alt="Snippet Box Logo">
</p>

<h1 align="center">Snippet Box</h1>

<p align="center">
  <strong>Премиальный менеджер сниппетов для разработчиков, которые ценят скорость и эстетику.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri&logoColor=white" alt="Tauri">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/OS-macOS%20%7C%20Windows-lightgrey" alt="Platforms">
</p>

---

## ✨ Особенности

*   **🚀 Глобальный доступ**: Вызывайте Snippet Box из любого приложения с помощью настраиваемого горячего клавиши (по умолчанию `Cmd+Shift+X`).
*   **🧩 Умные переменные**: Используйте `{{variable}}` в своем коде. При копировании приложение предложит заполнить значения прямо в окне предпросмотра.
*   **🎨 Премиальный дизайн**: Современный интерфейс с поддержкой тем (Light/Dark), плавными анимациями на Framer Motion и Glassmorphism эффектами.
*   **🌐 Полная локализация**: Интерфейс и документация доступны на **Русском** и **Английском** языках.
*   **⚡️ Поддержка 14+ языков**: Подсветка синтаксиса через CodeMirror для JS, TS, Python, Rust, Go, SQL и многих других.
*   **📥 Мульти-файловые сниппеты**: Один сниппет может содержать несколько файлов — идеально для сложных компонентов или конфигураций.

---

## 🛠 Технологический стек

- **Core**: [Tauri 2](https://tauri.app/) (Rust) для безопасности и легкости.
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/).
- **Editor**: [CodeMirror 6](https://codemirror.net/) с кастомными расширениями для переменных.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) для «живого» интерфейса.
- **Storage**: Локальное хранилище через `tauri-plugin-store`.

---

---

## 🚀 Как начать пользоваться

### 📥 Скачивание
Самый простой способ попробовать Snippet Box — скачать готовый инсталлятор для вашей операционной системы со страницы **[Releases](https://github.com/frenzybe/snippet-box/releases)**.

- Для **macOS**: Скачайте `.dmg` (поддерживаются как Intel, так и Apple Silicon).
- Для **Windows**: Скачайте `.msi` установщик.

### 🛠 Сборка (для разработчиков)
Если вы хотите внести вклад в разработку или собрать приложение самостоятельно:
1. Установите [Node.js](https://nodejs.org/) и [Rust](https://www.rust-lang.org/tools/install).
2. Запустите `npm install`.
3. Запустите `npm run tauri dev` для режима разработки.

---

## 📅 CI/CD

Проект настроен на автоматическую сборку через **GitHub Actions**. Каждый раз, когда код попадает в ветку `release` или создается новый релиз с тегом `v*`, GitHub автоматически генерирует пакеты для macOS и Windows.

---

## 📄 Лицензия

MIT © [Snippet Box Team]
