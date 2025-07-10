// CreateInvoiceForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import CreateInvoiceStepper from "../components/CreateInvoiceStepper";
import StepPatientInfo from "../components/StepPatientInfo";
import StepSelectTests from "../components/StepSelectTests";
import StepSummary from "../components/StepSummary";
import { Box, Button } from "@mui/material";

const steps = ["Patient Info", "Select Tests", "Summary"];

function CreateInvoiceForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [patientId, setPatientId] = useState(null);

  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      phone: "",
      name: "",
      gender: "",
      age: "",
      address: "",
      tests: [],
      discountType: "percent",
      discountValue: 0,
    },
  });

  const phone = watch("phone");
  const selectedTestIds = watch("tests") || [];
  const discountType = watch("discountType");
  const discountValue = parseFloat(watch("discountValue")) || 0;

  const totalTestsPrice = selectedTestIds.reduce((sum, id) => {
    const test = tests.find((t) => t.id === id);
    return test ? sum + parseFloat(test.price) : sum;
  }, 0);

  let finalTotal = totalTestsPrice;
  if (discountType === "percent") {
    finalTotal = totalTestsPrice - (discountValue / 100) * totalTestsPrice;
  } else {
    finalTotal = totalTestsPrice - discountValue;
  }
  if (finalTotal < 0) finalTotal = 0;

  const handleNext = async () => {
    let valid = false;
    if (activeStep === 0) {
      valid = await trigger(["phone", "name", "gender", "age", "address"]);
    } else if (activeStep === 1) {
      valid = await trigger("tests");
    } else {
      valid = true;
    }

    if (valid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    let currentPatientId = patientId;

    try {
      // If patient not found, create one
      if (!currentPatientId) {
        const res = await axiosPublic.post("/api/v1/patient", {
          phone: data.phone,
          name: data.name,
          gender: data.gender,
          age: data.age,
          address: data.address,
        });

        currentPatientId = res.data?.id;
        if (!currentPatientId) throw new Error("Failed to create patient.");
      }

      if (selectedTestIds.length === 0) {
        alert("Please select at least one test.");
        return;
      }

      const payload = {
        patientId: currentPatientId,
        testIds: selectedTestIds,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
      };

      await axiosPublic.post("/api/v1/invoice", payload);
      alert("Invoice created successfully!");
      setActiveStep(0);
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice or patient.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        bgcolor: "background.paper",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CreateInvoiceStepper activeStep={activeStep} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {activeStep === 0 && (
          <StepPatientInfo
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            phone={phone}
            patientFound={patientFound}
            setPatientFound={setPatientFound}
            setPatientId={setPatientId}
            axiosPublic={axiosPublic}
          />
        )}

        {activeStep === 1 && (
          <StepSelectTests
            control={control}
            register={register}
            errors={errors}
            tests={tests}
            setTests={setTests}
            loadingTests={loadingTests}
            setLoadingTests={setLoadingTests}
            axiosPublic={axiosPublic}
          />
        )}

        {activeStep === 2 && (
          <StepSummary
            watch={watch}
            phone={phone}
            selectedTestIds={selectedTestIds}
            tests={tests}
            totalTestsPrice={totalTestsPrice}
            discountType={discountType}
            discountValue={discountValue}
            finalTotal={finalTotal}
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="success">
              Create Invoice
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default CreateInvoiceForm;
