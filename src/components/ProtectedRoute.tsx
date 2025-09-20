import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Outlet, useNavigate } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const Component = withAuthenticationRequired(Outlet);


  if (!isAuthenticated) {
    navigate("/");
  }
  return <Component />;
}

export default ProtectedRoute;
