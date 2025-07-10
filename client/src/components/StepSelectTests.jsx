import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

function StepSelectTests({
  control,
  register,
  errors,
  tests,
  setTests,
  loadingTests,
  setLoadingTests,
  axiosPublic,
}) {
  useEffect(() => {
    const fetchTests = async () => {
      setLoadingTests(true);
      try {
        const res = await axiosPublic.get("/api/v1/get-all-test");
        setTests(res.data || []);
      } catch {
        setTests([]);
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, [axiosPublic, setTests, setLoadingTests]);

  return (
    <>
      <Typography variant="h6">Select Tests</Typography>

      {loadingTests ? (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Controller
          name="tests"
          control={control}
          rules={{ required: "Select at least one test" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.tests}>
              <InputLabel id="tests-label">Tests</InputLabel>
              <Select
                labelId="tests-label"
                multiple
                {...field}
                input={<OutlinedInput label="Tests" />}
                renderValue={(selected) =>
                  selected
                    .map((id) => tests.find((t) => t.id === id)?.name)
                    .join(", ")
                }
              >
                {tests.map((test) => (
                  <MenuItem key={test.id} value={test.id}>
                    <Checkbox checked={field.value.includes(test.id)} />
                    <ListItemText primary={`${test.name} - $${test.price}`} />
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {errors.tests?.message}
              </Typography>
            </FormControl>
          )}
        />
      )}

      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="discount-type-label">Discount Type</InputLabel>
          <Select
            labelId="discount-type-label"
            label="Discount Type"
            defaultValue="percent"
            {...register("discountType")}
          >
            <MenuItem value="percent">Percent (%)</MenuItem>
            <MenuItem value="amount">Fixed ($)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Discount Value"
          type="number"
          sx={{ mt: 2 }}
          {...register("discountValue", {
            min: { value: 0, message: "Can't be negative" },
            validate: (v) => !isNaN(v) || "Must be a number",
          })}
          error={!!errors.discountValue}
          helperText={errors.discountValue?.message}
          fullWidth
        />
      </Box>
    </>
  );
}

export default StepSelectTests;
