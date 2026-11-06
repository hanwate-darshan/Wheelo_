import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export default async function Home() {
  const session = await auth();
  let plainUser = null;

  if (session?.user?.email) {
    try {
      await connectDb();
      const user = await User.findOne({ email: session.user.email }).lean();
      plainUser = user ? JSON.parse(JSON.stringify(user)) : null;
    } catch (e) {
      console.error("Error fetching home user:", e);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#09090b]">
      <GeoUpdater userId={plainUser?._id} />
      {plainUser?.role === "partner" ? (
        <>
          <Nav />
          <PartnerDashboard />
        </>
      ) : plainUser?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Nav />
          <PublicHome />
        </>
      )}

      <Footer />
    </div>
  );
}
