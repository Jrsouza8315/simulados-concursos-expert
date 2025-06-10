import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="main-content container mx-auto">
        <div className="max-w-7xl mx-auto py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
