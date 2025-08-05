import { Stepper, Step, StepLabel } from "@mui/material";

const steps = ["Patient Information", "Select Tests", "Summary"];

function CreateInvoiceStepper({ activeStep }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default CreateInvoiceStepper;
