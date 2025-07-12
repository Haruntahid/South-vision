import React, { useState, useRef } from "react";
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
  const [submitting, setSubmitting] = useState(false);
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [createInvoiceClicked, setCreateInvoiceClicked] = useState(false);

  const invoiceRef = useRef(); // for future use with print/download

  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    trigger,
    reset,
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
    if (!createInvoiceClicked || submitting || invoiceCreated) return;
    setSubmitting(true);

    try {
      let currentPatientId = patientId;

      // Create patient if not found
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

      const res = await axiosPublic.post("/api/v1/invoice", payload);

      alert("✅ Invoice created successfully!");
      setInvoiceCreated(true);
      setInvoiceData(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create invoice or patient.");
    } finally {
      setSubmitting(false);
      setCreateInvoiceClicked(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print(); // Replace with jsPDF or server-side PDF if needed
  };

  const handleReset = () => {
    setActiveStep(0);
    setPatientFound(false);
    setPatientId(null);
    setInvoiceCreated(false);
    setInvoiceData(null);
    setCreateInvoiceClicked(false);
    reset();
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
            watch={watch}
            errors={errors}
            tests={tests}
            setTests={setTests}
            loadingTests={loadingTests}
            setLoadingTests={setLoadingTests}
            axiosPublic={axiosPublic}
          />
        )}

        {activeStep === 2 && (
          <div ref={invoiceRef}>
            <StepSummary
              watch={watch}
              phone={phone}
              selectedTestIds={selectedTestIds}
              tests={tests}
              totalTestsPrice={totalTestsPrice}
              discountType={discountType}
              discountValue={discountValue}
              finalTotal={finalTotal}
              invoiceData={invoiceData}
            />
          </div>
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
            <Button
              onClick={() => {
                setCreateInvoiceClicked(true);
                handleSubmit(onSubmit)();
              }}
              variant="contained"
              color="success"
              disabled={submitting || invoiceCreated}
            >
              {submitting
                ? "Creating..."
                : invoiceCreated
                ? "Invoice Created"
                : "Create Invoice"}
            </Button>
          )}
        </Box>

        {activeStep === 2 && invoiceCreated && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleDownloadPDF}
              variant="outlined"
              color="primary"
            >
              Download PDF
            </Button>
            <Button onClick={handleReset} variant="outlined" color="secondary">
              Create New Invoice
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
}

export default CreateInvoiceForm;
