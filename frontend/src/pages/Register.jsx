
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {
  UserRound, Mail, Phone, LockKeyhole, Eye, EyeOff,
  CheckCircle2, Circle, ArrowRight, Target, Users, Zap
} from "lucide-react";
import Logo from "../assets/ProgressaMainLogo.png";

const Register = () => {

  const navigate = useNavigate();  
  const [form, setForm] = useState({
    U_name: "",
    Email: "",
    Phone: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    setSuccess("");
  };

  const validate = () => {
    const err = {};

    if (!form.U_name.trim())
      err.U_name = "Username is required";
    else if (form.U_name.trim().length < 3)
      err.U_name = "Minimum 3 characters required";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.U_name.trim()))
      err.U_name = "Only letters, numbers and _ allowed";

    if (!form.Email.trim())
      err.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email.trim()))
      err.Email = "Enter a valid email address";

    const phone = form.Phone.replace(/[\s()-]/g, "");

    if (!form.Phone.trim())
      err.Phone = "Phone number is required";
    else if (!/^\+?[0-9]{7,15}$/.test(phone))
      err.Phone = "Enter a valid phone number";

    if (!form.Password)
      err.Password = "Password is required";
    else if (form.Password.length < 8)
      err.Password = "Minimum 8 characters required";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(form.Password))
      err.Password = "Use uppercase, lowercase and a number";

    if (!form.ConfirmPassword)
      err.ConfirmPassword = "Please confirm your password";
    else if (form.Password !== form.ConfirmPassword)
      err.ConfirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});
      setSuccess("");

      const response = await fetch(
        "http://localhost:2108/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            U_name: form.U_name.trim(),
            Email: form.Email.trim(),
            Phone: form.Phone.trim(),
            Password: form.Password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Registration failed";
        const fieldErrors = {};

        if (/username|u_name/i.test(message))
          fieldErrors.U_name = message;
        else if (/email/i.test(message))
          fieldErrors.Email = message;
        else if (/phone/i.test(message))
          fieldErrors.Phone = message;
        else
          fieldErrors.general = message;

        setErrors(fieldErrors);
        return;
      }

      setSuccess(data.message || "Account created successfully!");
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        }
      navigate("/");

    } catch {
      setErrors({
        general: "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "U_name", label: "Username", placeholder: "Choose username", icon: UserRound, type: "text" },
    { name: "Email", label: "Email Address", placeholder: "you@example.com", icon: Mail, type: "email" },
    { name: "Phone", label: "Phone Number", placeholder: "Enter phone number", icon: Phone, type: "tel" },
    { name: "Password", label: "Password", placeholder: "Create password", icon: LockKeyhole, type: "password" },
    { name: "ConfirmPassword", label: "Confirm Password", placeholder: "Repeat password", icon: LockKeyhole, type: "password" },
  ];

  const features = [
    { icon: Target, title: "Smart Task Management", desc: "Organize tasks and manage priorities easily." },
    { icon: Users, title: "Team Collaboration", desc: "Work together and keep everyone connected." },
    { icon: Zap, title: "Track Your Progress", desc: "Monitor performance and achieve your goals." },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-white font-['Raleway',sans-serif] lg:h-screen lg:min-h-0 lg:overflow-hidden">

        {/* LEFT PANEL */}

        <section className="flex w-full items-center justify-center px-5 py-8 sm:px-10 lg:w-[55%] lg:py-4 xl:px-16">
          <div className="w-full max-w-[510px]">

            <Link to="/" className="inline-block mb-2">
              <img src={Logo} alt="Progressa" className="h-15 w-auto object-contain" />
            </Link>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-[#B1A7A6]">
                Welcome to Progressa
              </p>

              <h1 className="mt-1 font-['XMind','Raleway',sans-serif] text-3xl font-extrabold text-[#161A1D] sm:text-4xl">
                Create Account<span className="text-[#E5383B]">.</span>
              </h1>

              <p className="mt-1 text-sm text-[#B1A7A6]">
                Start organizing your work and achieving more.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">

                {fields.map((field) => {
                  const Icon = field.icon;
                  const isPassword = field.name === "Password";
                  const isConfirm = field.name === "ConfirmPassword";
                  const passwordField = isPassword || isConfirm;

                  return (
                    <div
                      key={field.name}
                      className={isConfirm ? "sm:col-span-2" : ""}
                    >
                      <label className="mb-1 block text-xs font-bold text-[#161A1D]">
                        {field.label}
                      </label>

                      <div className={`flex h-11 items-center gap-2.5 rounded-lg border px-3 transition-all duration-200
                        ${errors[field.name]
                          ? "border-[#E5383B] bg-[#E5383B]/[0.03]"
                          : "border-[#D3D3D3] bg-white focus-within:border-[#BA181B] focus-within:ring-2 focus-within:ring-[#BA181B]/10"
                        }`}
                      >
                        <Icon size={17} className="shrink-0 text-[#B1A7A6]" />

                        <input
                          name={field.name}
                          type={
                            isPassword ? (showPass ? "text" : "password") :
                            isConfirm ? (showConfirm ? "text" : "password") :
                            field.type
                          }
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          autoComplete={
                            isPassword ? "new-password" :
                            isConfirm ? "new-password" :
                            field.name === "Email" ? "email" :
                            field.name === "U_name" ? "username" : "tel"
                          }
                          className="h-full min-w-0 flex-1 bg-transparent text-xs text-[#161A1D] outline-none placeholder:text-[#B1A7A6]"
                        />

                        {passwordField && (
                          <button
                            type="button"
                            onClick={() =>
                              isPassword
                                ? setShowPass(!showPass)
                                : setShowConfirm(!showConfirm)
                            }
                            className="text-[#B1A7A6] transition hover:text-[#660708]"
                            aria-label="Toggle password visibility"
                          >
                            {(isPassword ? showPass : showConfirm)
                              ? <EyeOff size={17} />
                              : <Eye size={17} />
                            }
                          </button>
                        )}

                        {!passwordField && form[field.name] && !errors[field.name] && (
                          <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                        )}
                      </div>

                      <p className="mt-1 min-h-[17px] text-[10px] text-[#E5383B]">
                        {errors[field.name] || ""}
                      </p>
                    </div>
                  );
                })}

              </div>

              {/* Password requirements */}

              <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#B1A7A6]">
                <span className="flex items-center gap-1">
                  <Circle size={11} /> 8+ characters
                </span>
                <span className="flex items-center gap-1">
                  <Circle size={11} /> Uppercase & lowercase
                </span>
                <span className="flex items-center gap-1">
                  <Circle size={11} /> At least one number
                </span>
              </div>

              {errors.general && (
                <p className="mb-3 rounded-lg bg-[#E5383B]/10 p-2 text-xs text-[#A4161A]">
                  {errors.general}
                </p>
              )}

              {success && (
                <p className="mb-3 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#BA181B] text-sm font-bold tracking-wide text-white shadow-lg shadow-[#BA181B]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#660708] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                {!loading && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
              </button>

            </form>

            <p className="mt-4 text-center text-xs text-[#B1A7A6]">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-[#BA181B] hover:text-[#660708]">
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-[10px] text-[#B1A7A6]">
              © {new Date().getFullYear()} Progressa. All rights reserved.
            </p>

          </div>
        </section>

        {/* RIGHT PANEL */}

        <section className="relative hidden w-[45%] items-center justify-center overflow-hidden bg-[#660708] px-10 text-white lg:flex xl:px-16">

          {/* Background Decorations */}

          <div className="absolute -right-32 -top-28 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-12 h-[300px] w-[300px] rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#A4161A]/40" />

          <div className="absolute right-8 top-12 select-none text-[220px] font-black text-white/[0.035]">
            P
          </div>

          {/* About Content */}

          <div className="relative z-10 w-full max-w-[450px]">

            <div className="mb-10">
              <span className="text-xs font-bold uppercase tracking-[4px] text-white/50">
                About Progressa
              </span>

              <h2 className="mt-5 font-['XMind','Raleway',sans-serif] text-4xl font-extrabold leading-tight xl:text-5xl">
                Make Every
                <span className="block text-[#E5383B]">Step Count.</span>
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
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition duration-300 hover:scale-110 hover:bg-[#BA181B]">
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

      </div>
    </>
  );
};

export default Register;
