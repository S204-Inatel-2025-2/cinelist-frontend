
// /src/Layouts/PrivateLayout
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function PrivateLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
}

export default PrivateLayout;
