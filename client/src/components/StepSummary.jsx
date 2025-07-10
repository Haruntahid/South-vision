import React from "react";
import { Typography, Box } from "@mui/material";

function StepSummary({
  watch,
  phone,
  selectedTestIds,
  tests,
  totalTestsPrice,
  discountType,
  discountValue,
  finalTotal,
}) {
  return (
    <>
      <Typography variant="h6">Summary</Typography>
      <Box sx={{ mt: 1 }}>
        <Typography>
          <strong>Phone:</strong> {phone}
        </Typography>
        <Typography>
          <strong>Name:</strong> {watch("name")}
        </Typography>
        <Typography>
          <strong>Gender:</strong> {watch("gender")}
        </Typography>
        <Typography>
          <strong>Age:</strong> {watch("age")}
        </Typography>
        <Typography>
          <strong>Address:</strong> {watch("address")}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography>
          <strong>Selected Tests:</strong>
        </Typography>
        <ul>
          {selectedTestIds.map((id) => {
            const test = tests.find((t) => t.id === id);
            return test ? (
              <li key={id}>
                {test.name} - ${test.price}
              </li>
            ) : null;
          })}
        </ul>
      </Box>

      <Typography sx={{ mt: 2 }}>
        <strong>Total:</strong> ${totalTestsPrice.toFixed(2)}
      </Typography>
      <Typography>
        <strong>Discount:</strong>{" "}
        {discountType === "percent"
          ? `${discountValue}%`
          : `$${discountValue.toFixed(2)}`}
      </Typography>
      <Typography>
        <strong>Final Total:</strong> ${finalTotal.toFixed(2)}
      </Typography>
    </>
  );
}

export default StepSummary;
