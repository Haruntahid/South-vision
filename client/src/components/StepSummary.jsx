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
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        Invoice Summary
      </Typography>

      {/* Patient Info */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Patient Information
        </Typography>
        <Typography variant="body2" gutterBottom>
          📞 Phone: {phone}
        </Typography>
        <Typography variant="body2" gutterBottom>
          👤 Name: {name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          ⚧ Gender: {gender}
        </Typography>
        <Typography variant="body2" gutterBottom>
          📆 Age: {age}
        </Typography>
        <Typography variant="body2">🏠 Address: {address}</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Test List */}
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Selected Tests
      </Typography>
      <List dense disablePadding>
        {selectedTestIds.map((id) => {
          const test = tests.find((t) => t.id === id);
          return (
            test && (
              <ListItem key={id} sx={{ pl: 0, py: 0.5 }}>
                <ListItemText
                  primary={test.name}
                  secondary={`৳${parseFloat(test.price).toFixed(2)}`}
                  primaryTypographyProps={{ variant: "body2" }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            )
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Price Summary */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="body2">
          <strong>Total Price:</strong> ৳{totalTestsPrice.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          <strong>Discount:</strong> ৳{discountAmount.toFixed(2)}{" "}
          {discountType === "percent" ? `(${discountValue}%)` : ""}
        </Typography>
        <Typography variant="body2" sx={{ color: "green", fontWeight: 600 }}>
          <strong>Final Total:</strong> ৳{finalTotal.toFixed(2)}
        </Typography>
      </Box>

      {/* Optional Invoice Data */}
      {invoiceData && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            🧾 Invoice Number: {invoiceData?.invoice?.invoiceNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            📅 Created At:{" "}
            {new Date(invoiceData?.invoice?.createdAt).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default StepSummary;
