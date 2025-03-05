import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      title: "Easy Time Tracking",
      description: "Log hours with just a few clicks. Simple, intuitive interface designed for efficiency.",
      icon: "⏳",
    },
    {
      title: "Real-time Reports",
      description: "Get instant insights into your team's time allocation and project progress.",
      icon: "📊",
    },
    {
      title: "Team Management",
      description: "Efficiently manage your team's schedules, projects, and workload distribution.",
      icon: "👥",
    },
    {
      title: "Seamless Integrations",
      description: "Connect with your favorite tools and streamline workflows effortlessly.",
      icon: "🔗",
    },
    {
      title: "Advanced Security",
      description: "Your data is protected with top-tier encryption and security protocols.",
      icon: "🔒",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#e5e7eb] to-[#d1d5db] text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-50 border-b border-gray-300 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
            BMS
          </motion.h1>
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection("home")} className="hover:text-blue-500 transition">Home</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-blue-500 transition">About</button>
          </div>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 shadow-lg">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
        <motion.div className="container mx-auto px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Track Time, Boost Productivity
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Streamline your time tracking with Blue Marlin System. Simple, intuitive, and designed for modern teams.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-110 shadow-lg">Get Started</Button>
            </Link>
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/20" onClick={() => scrollToSection("about")}>Learn More</Button>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-[#e5e7eb] to-[#f3f4f6]">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
            Why Choose Blue Marlin System?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div key={index} className="p-6 rounded-xl bg-white hover:bg-gray-100 transition-all shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-500 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
