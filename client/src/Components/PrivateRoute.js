import { Navigate } from "react-router-dom";

function PrivateRoute({ logedIn, children }) {
  if (!logedIn) {
    return <Navigate to="/" />;
  }
  return children;
}

export default PrivateRoute;
