# Pratikraj Shinde | UI/UX Designer & Front-End Developer

A modern, responsive, and accessible personal portfolio website for Pratikraj Shinde, a UI/UX designer and front-end developer based in Chhatrapati Sambhajinagar, Maharashtra, India. 

The site is built completely from scratch using **Semantic HTML, Vanilla CSS (Grid & Flexbox), and Vanilla JavaScript**. It features a sleek dark-themed design with vibrant purple/pink accents, subtle animations, and a focus on premium user experience without relying on any external frontend frameworks or heavy libraries.

## 🚀 Features

- **Modern Dark UI:** A deep dark theme (`#080909`) with neon purple accents, styled completely with CSS custom variables.
- **Bento Grid Layout:** Clean and structured representation of skills and tools using a responsive CSS Grid.
- **Built-in Quick Search:** An interactive search dialog (`Ctrl+K` style) that allows users to instantly search for sections, projects (AfterGlow, Flexr), and direct social links (Email, GitHub, LinkedIn, Instagram).
- **Custom CSS Animations:** Includes continuous marquees for the tech stack and a fully automated CSS-only image slider for project thumbnails.
- **Responsive & Mobile-First:** Fluid layouts that adapt beautifully from small mobile screens to large desktop monitors.
- **Admin Dashboard UI:** Includes an `admin.html` page protected by a simple client-side `sessionStorage` login for managing form responses (backend integration ready).
- **Smooth Navigation:** Intersection Observer-based active link highlighting and smooth scrolling to sections.

## 🛠️ Technologies Used

- **HTML5:** Semantic structure and accessibility.
- **CSS3:** Flexbox, CSS Grid, Media Queries, Custom Properties (Variables), Keyframe Animations.
- **JavaScript (ES6+):** Vanilla JS Modules, DOM Manipulation, Event Listeners, Intersection Observer API.
- **Backend (API Ready):** Pre-configured Google Apps Script (`js/api.js`) to handle contact form submissions into Google Sheets.

## 📂 Folder Structure

```text
.
├── index.html          # Main portfolio page
├── admin.html          # Admin dashboard UI
├── css/
│   ├── style.css       # Core styling, variables, typography, animations
│   └── responsive.css  # Media queries and responsive adjustments
├── js/
│   ├── main.js         # Core logic (navigation, search, smooth scroll)
│   ├── contact.js      # Contact form handling and validation
│   ├── admin.js        # Admin login and dashboard logic
│   └── api.js          # API client for form submissions
├── assets/
│   ├── images/         # Project thumbnails, portraits, etc.
│   ├── icons/          # Favicon (SVG) and other icons
│   └── resume/         # Downloadable PDF resume
└── README.md           # Project documentation
```

## 🔧 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pratikkshinde/pratikk.git
   ```
2. **Open the project in VS Code.**
3. **Serve Locally:** 
   Because the project uses JavaScript ES Modules (`<script type="module">`), it must be served over HTTP rather than opening the file directly.
   - Use the **Live Server** extension in VS Code, OR
   - Run a quick Python server from your terminal: `python -m http.server 8080`
4. Open `http://localhost:8080` in your browser.

## 🔗 Deployment

This project requires no build steps (no Webpack, Vite, or npm installs). It can be directly hosted on any static hosting platform:
- **Vercel**
- **Netlify**
- **GitHub Pages**

Simply connect your GitHub repository to your preferred hosting provider, and the site will be live instantly.

## ✉️ Contact Form & API Configuration

The contact form is designed to work with Google Apps Script to save responses directly into a Google Sheet.
1. Deploy your Google Apps Script (`Code.gs`) as a Web App.
2. Copy the resulting `/exec` URL.
3. Open `js/api.js` and paste your URL into the `API_URL` constant.
4. The form will now securely send messages to your Google Sheet without page reloads.

## 👨‍💻 Author

**Pratikraj Shinde**
- GitHub: [@pratikkshinde](https://github.com/pratikkshinde)
- LinkedIn: [Pratikraj Shinde](https://www.linkedin.com/in/pratikraj-shinde-a398b7309/)
- Instagram: [@pratikkshinde_](https://instagram.com/pratikkshinde_)
