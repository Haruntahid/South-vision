import React from "react";
import {
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function StepSummary({
  watch,
  phone,
  selectedTestIds,
  tests,
  totalTestsPrice,
  discountType,
  discountValue,
  finalTotal,
  invoiceData,
}) {
  const name = watch("name");
  const gender = watch("gender");
  const age = watch("age");
  const address = watch("address");

  // Calculate discount amount
  const discountAmount =
    discountType === "percent"
      ? (totalTestsPrice * discountValue) / 100
      : discountValue;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Invoice Summary
      </Typography>

      {/* Patient Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Patient Information
        </Typography>
        <Typography>📞 Phone: {phone}</Typography>
        <Typography>👤 Name: {name}</Typography>
        <Typography>⚧ Gender: {gender}</Typography>
        <Typography>🎂 Age: {age}</Typography>
        <Typography>🏠 Address: {address}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Test List */}
      <Typography variant="subtitle1" fontWeight="bold">
        Selected Tests
      </Typography>
      <List dense>
        {selectedTestIds.map((id) => {
          const test = tests.find((t) => t.id === id);
          return (
            test && (
              <ListItem key={id} sx={{ pl: 0 }}>
                <ListItemText
                  primary={`${test.name}`}
                  secondary={`৳${parseFloat(test.price).toFixed(2)}`}
                />
              </ListItem>
            )
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Price Summary */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography>
          <strong>Total Price:</strong> ৳{totalTestsPrice.toFixed(2)}
        </Typography>
        <Typography>
          <strong>Discount:</strong> ৳{discountAmount.toFixed(2)}{" "}
          {discountType === "percent" ? `(${discountValue}%)` : ""}
        </Typography>
        <Typography>
          <strong>Final Total:</strong>{" "}
          <span style={{ color: "green", fontWeight: 600 }}>
            ৳{finalTotal.toFixed(2)}
          </span>
        </Typography>
      </Box>

      {/* Optional: Show Invoice ID or Date */}
      {invoiceData && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            🧾 Invoice ID: {invoiceData?.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📅 Created At: {new Date(invoiceData?.createdAt).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default StepSummary;
