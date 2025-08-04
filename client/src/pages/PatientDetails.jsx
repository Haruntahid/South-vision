import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaUser,
  FaTransgender,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMale,
  FaFemale,
} from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axiosPublic.get(`/api/v1/patient/${id}`);
        setPatient(res.data);
        setFormData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load patient", error);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, axiosPublic]);

  const validateForm = () => {
    const newErrors = {};
    const { name, phone, gender, age, address } = formData;

    if (!name || name.length < 2)
      newErrors.name = "Name is required (min 2 characters)";
    if (!phone) newErrors.phone = "Phone is required";
    else if (!/^01[0-9]{9}$/.test(phone))
      newErrors.phone = "Phone must be 11 digits and valid";
    if (!gender) newErrors.gender = "Gender is required";
    if (age === undefined || age === "") newErrors.age = "Age is required";
    else if (age < 0 || age > 150)
      newErrors.age = "Age must be between 0 and 150";
    if (!address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axiosPublic.patch(`/api/v1/patient/${id}`, formData);
      setPatient(formData);
      setIsEditing(false);
      setSuccessMsg("Patient information updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const inputWrapper = "relative mb-4";
  const iconClass =
    "absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none";
  const inputClass = (field) =>
    `w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!patient)
    return <p className="text-center mt-4 text-red-500">Patient not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Patient Details
      </h2>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
          {successMsg}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Name</label>
          <div className="relative">
            <span className={iconClass}>
              <FaUser />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className={inputClass("name")}
              disabled={!isEditing}
              placeholder="Patient's name"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Phone</label>
          <div className="relative">
            <span className={iconClass}>
              <FaPhoneAlt />
            </span>
            <input
              type="text"
              name="phone"
              maxLength={11}
              value={formData.phone || ""}
              onChange={handleChange}
              className={inputClass("phone")}
              disabled={!isEditing}
              placeholder="01XXXXXXXXX"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Gender</label>
          <div className="relative">
            <span className={iconClass}>
              {formData.gender === "male" && <FaMale />}
              {formData.gender === "female" && <FaFemale />}
              {!formData.gender && <FaTransgender />}
            </span>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className={inputClass("gender")}
              disabled={!isEditing}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Age */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Age</label>
          <div className="relative">
            <span className={iconClass}>
              <FaCalendarAlt />
            </span>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              className={inputClass("age")}
              disabled={!isEditing}
              placeholder="e.g. 30"
            />
          </div>
          {errors.age && (
            <p className="text-red-500 text-xs mt-1">{errors.age}</p>
          )}
        </div>

        {/* Address */}
        <div className={inputWrapper}>
          <label className="block font-semibold mb-1">Address</label>
          <div className="relative">
            <span className={`${iconClass} items-start pt-3 z-10`}>
              <FaMapMarkerAlt />
            </span>
            <textarea
              name="address"
              rows={2}
              value={formData.address || ""}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={!isEditing}
              placeholder="Patient's address"
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          ← Back
        </button>

        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;
