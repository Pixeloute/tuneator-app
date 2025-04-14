
import { useEffect } from "react";
import Dashboard from "@/components/dashboard/Dashboard";

const Index = () => {
  useEffect(() => {
    document.title = "Tuneator - Dashboard";
  }, []);

  return <Dashboard />;
};

export default Index;
