
// /src/Layouts/PublicLayout
import Footer from "../components/Footer";
import NavBarLogin from "../components/NavBarLogin";
function PublicLayout({children}){
return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Caixa centralizada */}
      <NavBarLogin />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );

}

export default PublicLayout