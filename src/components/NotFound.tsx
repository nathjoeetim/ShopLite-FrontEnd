import { Link } from "react-router-dom";

const notFoundStyles = {
  container: "flex flex-col items-center justify-center h-full text-center p-6",
  heading: "text-4xl font-bold text-gray-800 mb-4",
  message: "text-lg text-gray-600 mb-6",
  link: "text-blue-500 hover:text-blue-700 font-medium",
};

function NotFound() {
  return (
    <div className={notFoundStyles.container}>
      <h1 className={notFoundStyles.heading}>404 - Page Not Found</h1>
      <p className={notFoundStyles.message}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" className={notFoundStyles.link}>
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
