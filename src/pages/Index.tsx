import BmsDashboard from "@/components/dashboard/Dashboard";

const Home = () => {
  return (
    <div className="min-h-screen pt-32 px-3">
        <BmsDashboard />
      {/* <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-nav-foreground mb-6">Welcome</h1>
        <p className="text-nav-muted text-lg">
          Navigate through the application using the menu above.
        </p>
      </div> */}
    </div>
  );
};

export default Home;
