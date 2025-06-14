import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Dashboard } from "./components/Dashboard";
import { QuestionForm } from "./components/QuestionForm";
import { ApostilaUpload } from "./components/ApostilaUpload";
import { Statistics } from "./components/Statistics";
import { Settings } from "./components/Settings";
import { Sidebar } from "./components/Sidebar";
import { Alert } from "../../components/Alert";

export function AdminPage() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/");
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <main className="flex-1 overflow-y-auto p-8">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {currentSection === "dashboard" && <Dashboard />}
        {currentSection === "questions" && <QuestionForm />}
        {currentSection === "apostilas" && <ApostilaUpload />}
        {currentSection === "statistics" && <Statistics />}
        {currentSection === "settings" && <Settings />}
      </main>
    </div>
  );
}
