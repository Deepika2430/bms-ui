import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-5xl font-bold text-blue-600">Welcome to Vite + Tailwind</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
