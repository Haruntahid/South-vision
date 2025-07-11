import React, { useEffect } from "react";

function StepPatientInfo({
  register,
  errors,
  watch,
  setValue,
  phone,
  patientFound,
  setPatientFound,
  setPatientId,
  axiosPublic,
}) {
  const gender = watch("gender");

  useEffect(() => {
    const fetchPatient = async () => {
      if (!phone || !/^01[0-9]{9}$/.test(phone)) {
        setPatientFound(false);
        setPatientId(null);
        setValue("name", "");
        setValue("gender", "");
        setValue("age", "");
        setValue("address", "");
        return;
      }

      try {
        const res = await axiosPublic.get("/api/v1/patient", {
          params: { phone },
        });

        if (res.data?.length > 0) {
          const patient = res.data[0];
          setValue("name", patient.name);
          setValue("gender", patient.gender);
          setValue("age", patient.age);
          setValue("address", patient.address);
          setPatientFound(true);
          setPatientId(patient.id);
        } else {
          setValue("name", "");
          setValue("gender", "");
          setValue("age", "");
          setValue("address", "");
          setPatientFound(false);
          setPatientId(null);
        }
      } catch {
        setPatientFound(false);
        setPatientId(null);
      }
    };

    fetchPatient();
  }, [phone, setValue, axiosPublic, setPatientFound, setPatientId]);

  return (
    <div className="flex flex-col gap-4">
      {/* Phone */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Phone</label>
        <input
          type="text"
          placeholder="Enter phone number"
          className={`input input-bordered w-full ${
            errors.phone ? "border-red-500" : ""
          }`}
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^01[0-9]{9}$/,
              message: "Invalid phone number",
            },
          })}
        />
        {!patientFound && errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          className={`input input-bordered w-full ${
            errors.name ? "border-red-500" : ""
          }`}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "At least 2 characters" },
          })}
          readOnly={patientFound}
        />
        {!patientFound && errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Gender</label>
        <select
          className={`select select-bordered w-full ${
            errors.gender ? "border-red-500" : ""
          }`}
          {...register("gender", {
            required: "Gender is required",
          })}
          value={gender || ""}
          disabled={patientFound}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {!patientFound && errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* Age */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Age</label>
        <input
          type="number"
          placeholder="Enter age"
          className={`input input-bordered w-full ${
            errors.age ? "border-red-500" : ""
          }`}
          {...register("age", {
            valueAsNumber: true,
            min: { value: 0, message: "Too small" },
            max: { value: 150, message: "Too high" },
          })}
          readOnly={patientFound}
        />
        {!patientFound && errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Address</label>
        <textarea
          rows={2}
          placeholder="Enter address"
          className={`textarea textarea-bordered w-full ${
            errors.address ? "border-red-500" : ""
          }`}
          {...register("address", {
            required: "Address required",
          })}
          readOnly={patientFound}
        />
        {!patientFound && errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>
    </div>
  );
}

export default StepPatientInfo;
