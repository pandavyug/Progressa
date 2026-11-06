// import { NavLink, useNavigate } from "react-router-dom";
// import { API } from "../config/api.js"; 
// import {
//   LayoutDashboard,
//   CheckSquare,
//   FolderKanban,
//   CalendarDays,
//   Users,
//   ChartNoAxesCombined,
//   Settings,
//   LogOut
// } from "lucide-react";
// import Logo from "../assets/ProgressaMainLogo2.png";

// const Sidebar = () => {
//   const navigate = useNavigate();

//   const navigation = [
//     { name: "Dashboard", icon: LayoutDashboard, path: "/", active: true },
//     { name: "Tasks", icon: CheckSquare, path: "/tasks" },
//     { name: "Projects", icon: FolderKanban, path: "/projects" },
//     { name: "Calendar", icon: CalendarDays, path: "/calendar" },
//     { name: "Team", icon: Users, path: "/team" },
//     { name: "Reports", icon: ChartNoAxesCombined, path: "/reports" },
//     { name: "Settings", icon: Settings, path: "/settings" }
//   ];

//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${API}/auth/logout`, {
//         method: "POST",
//         credentials: "include"
//       });

//       if (!response.ok) {
//         console.error("Logout request failed");
//         return;
//       }

//       localStorage.removeItem("user");
//       navigate("/login", { replace: true });
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <>
//       <aside className="fixed left-0 top-0 z-40 flex h-screen w-[235px] flex-col border-r border-[#D3D3D3]/60 bg-[#161A1D] text-white">

//         {/* Logo */}

//         <div className="flex h-[85px] items-center px-7">
//           <img
//             src={Logo}
//             alt="Progressa"
//             className="h-12 w-auto object-contain"
//           />
//         </div>

//         {/* Navigation */}

//         <div className="flex-1 px-3 py-7">

//           <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[2px] text-white/35">
//             Workspace
//           </p>

//           <nav className="space-y-2">

//             {navigation.map((item) => {
//               const Icon = item.icon;

//               return (
//                 <NavLink
//                   key={item.name}
//                   to={item.path}
//                   end={item.path === "/"}
//                   className={({ isActive }) =>
//                     `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
//                       isActive
//                         ? "border-l-[3px] border-[#E5383B] bg-[#BA181B]/25 text-white shadow-lg shadow-black/10"
//                         : "border-l-[3px] border-transparent text-white/55 hover:bg-white/5 hover:text-white"
//                     }`
//                   }
//                 >
//                   <Icon size={19} strokeWidth={1.8} />
//                   {item.name}
//                 </NavLink>
//               );
//             })}

//           </nav>

//         </div>

//         {/* Bottom section */}

//         <div className="border-t border-white/10 p-4">

//           <div className="mb-4 rounded-xl bg-white/[0.05] p-3">
//             <p className="text-xs font-bold text-white">
//               Make Progress Every Day
//             </p>

//             <p className="mt-1 text-[10px] leading-5 text-white/45">
//               Stay focused and keep moving towards your goals.
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/55 transition hover:bg-[#BA181B]/20 hover:text-white"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>

//           <p className="mt-3 text-center text-[10px] text-white/30">
//             © {new Date().getFullYear()} Progressa
//           </p>

//         </div>

//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API } from "../config/api.js";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  CalendarDays,
  Users,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  X
} from "lucide-react";
import Logo from "../assets/ProgressaMainLogo2.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Listen for the hamburger button click in Navbar
  useEffect(() => {
    const toggleSidebar = () => {
      setIsMobileOpen((prev) => !prev);
    };

    const closeSidebar = () => {
      setIsMobileOpen(false);
    };

    window.addEventListener("progressa:toggle-sidebar", toggleSidebar);
    window.addEventListener("progressa:close-sidebar", closeSidebar);

    return () => {
      window.removeEventListener("progressa:toggle-sidebar", toggleSidebar);
      window.removeEventListener("progressa:close-sidebar", closeSidebar);
    };
  }, []);

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Tasks", icon: CheckSquare, path: "/tasks" },
    { name: "Projects", icon: FolderKanban, path: "/projects" },
    { name: "Calendar", icon: CalendarDays, path: "/calendar" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "Reports", icon: ChartNoAxesCombined, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        console.error("Logout request failed");
        return;
      }

      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[235px] flex-col border-r border-[#D3D3D3]/60 bg-[#161A1D] text-white transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex h-[85px] items-center justify-between px-7">
          <img
            src={Logo}
            alt="Progressa"
            className="h-12 w-auto object-contain"
          />

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-7">

          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[2px] text-white/35">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "border-l-[3px] border-[#E5383B] bg-[#BA181B]/25 text-white shadow-lg shadow-black/10"
                        : "border-l-[3px] border-transparent text-white/55 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-4">

          <div className="mb-4 rounded-xl bg-white/[0.05] p-3">
            <p className="text-xs font-bold text-white">
              Make Progress Every Day
            </p>

            <p className="mt-1 text-[10px] leading-5 text-white/45">
              Stay focused and keep moving towards your goals.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/55 transition hover:bg-[#BA181B]/20 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>

          <p className="mt-3 text-center text-[10px] text-white/30">
            © {new Date().getFullYear()} Progressa
          </p>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;
