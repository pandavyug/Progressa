
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Logo from "../assets/ProgressaMainLogo.png";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Email: "",
    Password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validate = () => {
    const err = {};

    if (!form.Email.trim())
      err.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email.trim()))
      err.Email = "Enter a valid email address";

    if (!form.Password)
      err.Password = "Password is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      const response = await fetch(
        "http://localhost:2108/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: form.Email.trim(),
            Password: form.Password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message || "Invalid email or password",
        });
        return;
      }

      // Save authentication token if returned by backend
      

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/");

    } catch (error) {
      setErrors({
        general: "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "Smart Task Management",
      desc: "Organize tasks and manage priorities easily.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Work together and keep everyone connected.",
    },
    {
      icon: Zap,
      title: "Track Your Progress",
      desc: "Monitor performance and achieve your goals.",
    },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-white font-['Raleway',sans-serif] lg:h-screen lg:min-h-0 lg:overflow-hidden">

        {/* LEFT PANEL - ABOUT PROGRESSA */}

        <section className="relative hidden w-[45%] items-center justify-center overflow-hidden bg-[#660708] px-10 text-white lg:flex xl:px-16">

          <div className="absolute -right-32 -top-28 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-12 h-[300px] w-[300px] rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#A4161A]/40" />

          <div className="absolute right-8 top-12 select-none text-[220px] font-black text-white/[0.035]">
            P
          </div>

          <div className="relative z-10 w-full max-w-[450px]">

            <div className="mb-10">
              <span className="text-xs font-bold uppercase tracking-[4px] text-white/50">
                About Progressa
              </span>

              <h2 className="mt-5 font-['XMind','Raleway',sans-serif] text-4xl font-extrabold leading-tight xl:text-5xl">
                Make Every
                <span className="block text-[#E5383B]">
                  Step Count.
                </span>
              </h2>

              <p className="mt-5 max-w-[390px] text-sm leading-7 text-white/65">
                Progressa brings your projects, tasks and teams
                together in one place. Plan your work, stay focused
                and turn your ideas into achievements.
              </p>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold">
                Why Progressa?
              </h3>

              <div className="space-y-6">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="flex items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 transition duration-300 hover:scale-110 hover:bg-[#BA181B]">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold">
                          {feature.title}
                        </h4>

                        <p className="mt-1 text-xs text-white/55">
                          {feature.desc}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.07] p-4">
              <p className="text-sm font-semibold">
                Your goals. Your journey. Your progress.
              </p>

              <p className="mt-1 text-xs text-white/50">
                Everything starts with one small step.
              </p>
            </div>

          </div>

          <p className="absolute bottom-2 right-65 text-[10px] tracking-[3px] text-white/30">
            PLAN • ORGANIZE • ACHIEVE
          </p>

        </section>

        {/* RIGHT PANEL - LOGIN FORM */}

        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[55%] lg:py-4 xl:px-16">

          <div className="w-full max-w-[450px]">

            <Link to="/" className="mb-2 inline-block">
              <img
                src={Logo}
                alt="Progressa"
                className="h-15 w-auto object-contain"
              />
            </Link>

            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-[#B1A7A6]">
                Welcome Back
              </p>

              <h1 className="mt-2 font-['XMind','Raleway',sans-serif] text-4xl font-extrabold text-[#161A1D]">
                Login<span className="text-[#E5383B]">.</span>
              </h1>

              <p className="mt-2 text-sm text-[#B1A7A6]">
                Sign in to continue your progress.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}

              <div>
                <label className="mb-2 block text-xs font-bold text-[#161A1D]">
                  Email Address
                </label>

                <div className={`flex h-12 items-center gap-3 rounded-lg border px-4 transition-all
                  ${errors.Email
                    ? "border-[#E5383B]"
                    : "border-[#D3D3D3] focus-within:border-[#BA181B] focus-within:ring-2 focus-within:ring-[#BA181B]/10"
                  }`}
                >
                  <Mail size={18} className="text-[#B1A7A6]" />

                  <input
                    type="email"
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#B1A7A6]"
                  />
                </div>

                <p className="mt-1 min-h-[17px] text-[11px] text-[#E5383B]">
                  {errors.Email || ""}
                </p>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-xs font-bold text-[#161A1D]">
                  Password
                </label>

                <div className={`flex h-12 items-center gap-3 rounded-lg border px-4 transition-all
                  ${errors.Password
                    ? "border-[#E5383B]"
                    : "border-[#D3D3D3] focus-within:border-[#BA181B] focus-within:ring-2 focus-within:ring-[#BA181B]/10"
                  }`}
                >
                  <LockKeyhole size={18} className="text-[#B1A7A6]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    value={form.Password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#B1A7A6]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#B1A7A6] transition hover:text-[#660708]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />
                    }
                  </button>
                </div>

                <p className="mt-1 min-h-[17px] text-[11px] text-[#E5383B]">
                  {errors.Password || ""}
                </p>
              </div>

              {/* General API Error */}

              {errors.general && (
                <p className="rounded-lg bg-[#E5383B]/10 p-3 text-xs text-[#A4161A]">
                  {errors.general}
                </p>
              )}

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#BA181B] text-sm font-bold tracking-wide text-white shadow-lg shadow-[#BA181B]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#660708] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "SIGNING IN..." : "LOGIN"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

            </form>

            <p className="mt-7 text-center text-sm text-[#B1A7A6]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#BA181B] transition hover:text-[#660708]"
              >
                Create Account
              </Link>
            </p>

            <p className="mt-12 border-t border-[#F5F3F4] pt-5 text-center text-[10px] text-[#B1A7A6]">
              © {new Date().getFullYear()} Progressa. All rights reserved.
            </p>

          </div>

        </section>

      </div>
    </>
  );
};

export default Login;
