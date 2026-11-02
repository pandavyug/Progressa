import { useState } from "react";
import { Search, Bell, ChevronDown, X } from "lucide-react";

const Navbar = ({ userName, onSearch }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <>
      <header className="fixed left-[235px] right-0 top-0 z-30 flex h-[85px] items-center justify-between border-b border-[#D3D3D3]/60 bg-white/95 px-8 backdrop-blur-md">

        {/* Search */}

        <div className="flex w-full max-w-[520px] items-center gap-3 rounded-xl border border-[#D3D3D3]/70 bg-[#F5F3F4] px-4 transition focus-within:border-[#BA181B] focus-within:bg-white">

          <Search size={19} className="shrink-0 text-[#B1A7A6]" />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            className="h-11 w-full bg-transparent text-sm text-[#161A1D] outline-none placeholder:text-[#B1A7A6]"
          />

          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="text-[#B1A7A6] transition hover:text-[#BA181B]"
            >
              <X size={17} />
            </button>
          )}

        </div>

        {/* Right section */}

        <div className="ml-6 flex shrink-0 items-center gap-6">

          <button
            type="button"
            title="Notifications"
            className="relative rounded-full p-2 text-[#161A1D]/65 transition hover:bg-[#F5F3F4] hover:text-[#BA181B]"
          >
            <Bell size={21} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E5383B]" />
          </button>

          <div className="flex items-center gap-3 border-l border-[#D3D3D3] pl-6">

            <div className="min-w-0 text-right">
              <p className="max-w-[160px] truncate text-sm font-bold text-[#161A1D]">
                {userName || "Welcome"}
              </p>

              <p className="text-[10px] font-medium text-[#B1A7A6]">
                Progressa User
              </p>
            </div>

            <ChevronDown size={17} className="text-[#B1A7A6]" />

          </div>

        </div>

      </header>
    </>
  );
};

export default Navbar;