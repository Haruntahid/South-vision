import React, { useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

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
    <>
      <TextField
        label="Phone"
        {...register("phone", {
          required: "Phone is required",
          pattern: {
            value: /^01[0-9]{9}$/,
            message: "Invalid phone number",
          },
        })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
      />

      <TextField
        label="Name"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "At least 2 characters" },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        InputProps={{ readOnly: patientFound }}
      />

      <FormControl fullWidth error={!!errors.gender}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          label="Gender"
          {...register("gender", {
            required: "Gender is required",
          })}
          value={gender || ""}
          disabled={patientFound}
        >
          <MenuItem value="">Select gender</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
        <Typography variant="caption" color="error">
          {errors.gender?.message}
        </Typography>
      </FormControl>

      <TextField
        label="Age"
        type="number"
        {...register("age", {
          valueAsNumber: true,
          min: { value: 0, message: "Too small" },
          max: { value: 150, message: "Too high" },
        })}
        error={!!errors.age}
        helperText={errors.age?.message}
        fullWidth
        InputProps={{ readOnly: patientFound }}
      />

      <TextField
        label="Address"
        multiline
        rows={2}
        {...register("address", {
          required: "Address required",
        })}
        error={!!errors.address}
        helperText={errors.address?.message}
        fullWidth
        InputProps={{ readOnly: patientFound }}
      />
    </>
  );
}

export default StepPatientInfo;
