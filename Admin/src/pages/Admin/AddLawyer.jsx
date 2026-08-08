import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import api from "../../api/axiosClient";
import Loader from "../../components/common/Loader";
import { uploadToCloudinaryDirect } from "../../utils/directCloudinaryUpload";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const AddLawyer = () => {
  const [lawyerImg, setLawyerImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Criminal Lawyer");
  const [degree, setDegree] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminData } = useContext(AppContext);

  // ===================== PASSWORD VALIDATION ==========================
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLength = password.length >= 8;
  const passwordValid =
    hasUpper && hasLower && hasSpecial && hasNumber && hasLength;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!lawyerImg) {
      return toast.error("Image Not Selected");
    }

    if (!passwordValid) {
      return toast.error("Password does not meet the requirements");
    }

    if (lawyerImg.size > MAX_SIZE_BYTES) {
      return toast.error("Image size must be less than 2MB");
    }

    try {
      setLoading(true);

      if (!adminData) {
        toast.error("Please login first");
        return;
      }

      const { data: signature } = await api.post(
        "/api/admin/upload-signature",
      );
      if (!signature.success) {
        toast.error(signature.message || "Could not start image upload");
        return;
      }
      const cloudinaryResult = await uploadToCloudinaryDirect(
        lawyerImg,
        signature,
      );

      const { data } = await api.post("/api/admin/add-lawyer", {
        imageUrl: cloudinaryResult.secure_url,
        name,
        email,
        password,
        experience,
        fees: Number(fees),
        about,
        speciality,
        degree,
        address: {
          Location: location,
          City: city,
          State: state,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setLawyerImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setLocation("");
        setCity("");
        setState("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-7xl">
      <p className="mb-6 text-2xl font-bold text-gray-800">Add Lawyer</p>

      <div className="bg-white p-8 border border-gray-100 rounded-xl shadow-sm w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-6 mb-10 text-gray-600">
          <label htmlFor="lawyer-img" className="group cursor-pointer">
            <div className="relative">
              <img
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm group-hover:border-primary/20 transition-colors duration-300"
                src={
                  lawyerImg ? URL.createObjectURL(lawyerImg) : assets.upload_area
                }
                alt="Lawyer profile"
              />
              {!lawyerImg && (
                 <div className="absolute inset-0 bg-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl text-gray-400">+</span>
                 </div>
              )}
            </div>
          </label>
          <input
            type="file"
            id="lawyer-img"
            hidden
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error("Only JPG and PNG images are allowed");
                e.target.value = "";
                return;
              }

              if (file.size > MAX_SIZE_BYTES) {
                toast.error("Image size must be less than 2MB");
                e.target.value = "";
                return;
              }

              setLawyerImg(file);
            }}
          />
          <div className="flex flex-col">
            <p className="font-semibold text-gray-800 text-lg">Profile Picture</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload a high-quality headshot.<br />PNG or JPG, max 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                type="text"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Account Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 w-full pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                  type={showPassword ? "text" : "password"}
                  placeholder="Set securely"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <ul className="mt-2 text-[11px] bg-gray-50/80 p-3 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <li className={hasLength ? "text-green-600 font-medium" : "text-gray-500"}>
                    {hasLength ? "✓" : "○"} Min 8 chars
                  </li>
                  <li className={hasUpper ? "text-green-600 font-medium" : "text-gray-500"}>
                    {hasUpper ? "✓" : "○"} Uppercase
                  </li>
                  <li className={hasLower ? "text-green-600 font-medium" : "text-gray-500"}>
                    {hasLower ? "✓" : "○"} Lowercase
                  </li>
                  <li className={hasNumber ? "text-green-600 font-medium" : "text-gray-500"}>
                    {hasNumber ? "✓" : "○"} Number
                  </li>
                  <li className={`col-span-full ${hasSpecial ? "text-green-600 font-medium" : "text-gray-500"}`}>
                    {hasSpecial ? "✓" : "○"} Special character (!@#$%^&*...)
                  </li>
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Experience</label>
              <div className="relative">
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                >
                  <option>1 Year</option>
                  <option>2 Year</option>
                  <option>3 Year</option>
                  <option>4 Year</option>
                  <option>5 Year</option>
                  <option>6 Year</option>
                  <option>8 Year</option>
                  <option>9 Year</option>
                  <option>10 Year</option>
                  <option>&gt;10 Year</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Fees (₹)</label>
              <input
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                type="number"
                placeholder="e.g. 1500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Speciality</label>
              <div className="relative">
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                >
                  <option>Criminal Lawyer</option>
                  <option>Family & Divorce Lawyer</option>
                  <option>Corporate Lawyer</option>
                  <option>Civil Litigation Lawyer</option>
                  <option>Intellectual Property Lawyer</option>
                  <option>Tax Lawyer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Highest Degree</label>
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                type="text"
                placeholder="e.g. LL.B, LL.M"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Location Area</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                type="text"
                placeholder="Sector / Area Name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                  type="text"
                  placeholder="City"
                  required
                />
              </div>
               <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                  type="text"
                  placeholder="State"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Professional Summary (About)</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50 resize-y"
            placeholder="Write a brief professional summary detailing experience and specializations..."
            rows={5}
            required
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading || !passwordValid}
            className="bg-primary hover:bg-primary/95 px-10 py-3 text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {loading ? "Registering Lawyer..." : "Register Lawyer"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddLawyer;
