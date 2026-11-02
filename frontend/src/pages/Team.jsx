
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

const Team = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.U_name || "");
      } catch (error) {
        console.error("Unable to read user information.");
      }
    }
  }, []);

  return (
    <>
      <div className="min-h-screen mt-16 bg-[#F5F3F4]">
        <Sidebar />

        <div className="md:ml-64">
          <Navbar userName={userName} />

          <main className="flex min-h-[85vh] items-center justify-center p-6">
            <div className="text-center">
              <Users
                size={75}
                strokeWidth={1.5}
                className="mx-auto mb-6 text-[#BA181B]"
              />

              <h1 className="text-4xl font-extrabold text-[#161A1D] sm:text-6xl">
                Team
              </h1>

              <h2 className="mt-4 text-2xl font-bold text-[#BA181B] sm:text-4xl">
                Coming Soon!
              </h2>

              <p className="mx-auto mt-4 max-w-md text-sm text-gray-500 sm:text-base">
                We're working on something exciting.
                Team collaboration features will be available soon.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Team;
