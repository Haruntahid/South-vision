import { useEffect, useState } from "react";
import {
  FaSpinner,
  FaPhoneAlt,
  FaUser,
  FaTransgender,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMale,
  FaFemale,
} from "react-icons/fa";

function StepPatientInfo({
  register,
  errors,
  watch,
  setValue,
  reset,
  phone,
  patientFound,
  setPatientFound,
  setPatientId,
  axiosPublic,
  isSubmitted,
}) {
  const gender = watch("gender");
  const name = watch("name");
  const age = watch("age");
  const address = watch("address");

  const [loading, setLoading] = useState(false);
  const [patientSearched, setPatientSearched] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      const isValidPhone = /^01[0-9]{9}$/.test(phone);
      if (!phone || !isValidPhone) {
        setPatientFound(false);
        setPatientId(null);
        setPatientSearched(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosPublic.get("/api/v1/patient", {
          params: { search: phone },
        });

        if (res.data?.data?.length > 0) {
          const patient = res.data.data[0];
          setValue("name", patient.name);
          setValue("gender", patient.gender);
          setValue("age", patient.age);
          setValue("address", patient.address);
          setPatientFound(true);
          setPatientId(patient.id);
        } else {
          setPatientFound(false);
          setPatientId(null);
        }

        setPatientSearched(true);
      } catch {
        setPatientFound(false);
        setPatientId(null);
        setPatientSearched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [axiosPublic, phone, setPatientFound, setPatientId, setValue]);

  useEffect(() => {
    if (isSubmitted) {
      reset();
      setPatientFound(false);
      setPatientSearched(false);
      setPatientId(null);
    }
  }, [isSubmitted, reset, setPatientFound, setPatientId]);

  const wrapperClass = "relative";
  const iconClass =
    "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none";
  const inputClass = (hasError, value) =>
    `w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError && !value ? "border-red-500" : "border-gray-300"
    }`;
  const labelClass = "block mb-2 font-semibold text-sm text-gray-700";
  const errorText = (field, value) =>
    errors[field] &&
    !value && (
      <p className="text-red-500 text-xs mt-1">{errors[field].message}</p>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Phone */}
      <div className="mb-4">
        <label className={labelClass}>Phone</label>
        <div className={wrapperClass}>
          <span className={iconClass}>
            <FaPhoneAlt />
          </span>
          <input
            type="text"
            maxLength={11}
            placeholder="01XXXXXXXXX"
            className={inputClass(errors.phone, phone)}
            {...register("phone", {
              required: "Phone is required",
              validate: (value) => {
                if (!value) return "Phone is required";
                if (value.length < 11) return "Phone number must be 11 digits";
                if (!/^01[0-9]{9}$/.test(value)) return "Invalid phone number";
                return true;
              },
            })}
          />
          {loading && (
            <FaSpinner className="absolute right-3 top-2.5 animate-spin text-blue-500" />
          )}
        </div>
        {errorText("phone", phone)}
        {patientSearched && !patientFound && (
          <p className="text-yellow-600 text-sm mt-2">
            No patient found. Please enter details manually.
          </p>
        )}
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className={labelClass}>Name</label>
        <div className={wrapperClass}>
          <span className={iconClass}>
            <FaUser />
          </span>
          <input
            type="text"
            placeholder="Patient's name"
            className={inputClass(errors.name, name)}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
            readOnly={patientFound}
          />
        </div>
        {errorText("name", name)}
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label className={labelClass}>Gender</label>
        <div className={wrapperClass}>
          <span className={iconClass}>
            {gender === "male" && <FaMale />}
            {gender === "female" && <FaFemale />}
            {!gender && <FaTransgender />}
          </span>
          <select
            className={inputClass(errors.gender, gender)}
            {...register("gender", { required: "Gender is required" })}
            value={gender || ""}
            disabled={patientFound}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        {errorText("gender", gender)}
      </div>

      {/* Age */}
      <div className="mb-4">
        <label className={labelClass}>Age</label>
        <div className={wrapperClass}>
          <span className={iconClass}>
            <FaCalendarAlt />
          </span>
          <input
            type="number"
            placeholder="e.g. 30"
            className={inputClass(errors.age, age)}
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
              min: { value: 0, message: "Too small" },
              max: { value: 150, message: "Too high" },
            })}
            readOnly={patientFound}
          />
        </div>
        {errorText("age", age)}
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className={labelClass}>Address</label>
        <div className={wrapperClass}>
          <span className={iconClass + " items-start pt-3 z-10"}>
            <FaMapMarkerAlt />
          </span>
          <textarea
            rows={2}
            placeholder="Patient's address"
            className={`textarea textarea-bordered w-full pl-10 rounded-md shadow-sm ${
              errors.address && !address ? "border-red-500" : "border-gray-300"
            }`}
            {...register("address", {
              required: "Address required",
            })}
            readOnly={patientFound}
          />
        </div>
        {errorText("address", address)}
      </div>
    </div>
  );
}

export default StepPatientInfo;
