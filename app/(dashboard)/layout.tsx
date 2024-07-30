import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getCredits } from "@/lib/api-limit";

export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const creditCount = await getCredits()

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
                <Sidebar creditCount={creditCount} />
            </div>
            <main className="md:pl-72">
              <Navbar creditCount={creditCount} />
              {children}
            </main>
        </div>
    );
  }