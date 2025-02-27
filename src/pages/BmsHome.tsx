import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      title: "Easy Time Tracking",
      description: "Log hours with just a few clicks. Simple, intuitive interface designed for efficiency.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Real-time Reports",
      description: "Get instant insights into your team's time allocation and project progress.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Team Management",
      description: "Efficiently manage your team's schedules, projects, and workload distribution.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#dbeafe] to-[#eef2ff]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-indigo-300/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                BMS
              </h1>
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-700 hover:text-indigo-600 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-indigo-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-700 hover:text-indigo-600 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-indigo-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  About
                </button>
              </div>
            </div>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:opacity-90 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-400/30">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-orange-500/5 pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <span className="inline-block px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600/10 to-orange-500/10 text-indigo-600 rounded-full mb-6 shadow-lg">
              Timesheet Management System
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-indigo-600 via-orange-500 to-indigo-600 bg-clip-text text-transparent">
              Track Time, Boost Productivity
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Streamline your time tracking with Blue Marlin System.
              Simple, intuitive, and designed for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:opacity-90 text-white min-w-[160px] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-indigo-400/30">
                  Get Started
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-indigo-300/50 hover:bg-indigo-600/10 min-w-[160px] transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-white via-indigo-100 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
              Why Choose Blue Marlin System?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-indigo-300/50 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-300/20 hover:scale-105 bg-white/50 backdrop-blur-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600/10 to-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
