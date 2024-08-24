import "./App.css";
import Navbar from "./components/navbar";
import { AuthContextProvider } from "./contexts/authcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Router from "./components/router";
import { PublicBlogContextProvider } from "./contexts/publicBlogContext";
import { AdminAuthContextProvider } from "./contexts/adminauthContext";

function App() {
  return (
    <PublicBlogContextProvider>
      <AuthContextProvider>
        <AdminAuthContextProvider>
          <Navbar />
          <Router />
        </AdminAuthContextProvider>
      </AuthContextProvider>
    </PublicBlogContextProvider>
  );
}

export default App;
