import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
