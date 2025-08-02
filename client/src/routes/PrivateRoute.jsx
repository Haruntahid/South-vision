import { useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    if (location.pathname === "/login") {
      return <Navigate to="/" />;
    }
    return children;
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-green-500"></div>
      </div>
    );
  return (
    <>
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
}
PrivateRoute.propTypes = {
  children: PropTypes.any,
};
export default PrivateRoute;
