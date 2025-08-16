import React, { useEffect, useState, useRef } from "react";
import { Controller } from "react-hook-form";
import { FaTimes, FaChevronDown } from "react-icons/fa";

function StepSelectTests({
  control,
  register,
  errors,
  tests,
  watch,
  setTests,
  loadingTests,
  setLoadingTests,
  axiosPublic,
  trigger,
}) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const discountType = watch("discountType");
  const discountValue = Number(watch("discountValue")) || 0;

  const selectedTests = watch("tests")
    .map((id) => tests.find((t) => t.id === id))
    .filter(Boolean);

  const netAmount = selectedTests.reduce(
    (sum, test) => sum + Number(test?.price || 0),
    0
  );

  const discountAmount =
    discountType === "percent"
      ? (netAmount * discountValue) / 100
      : Math.min(discountValue, netAmount);

  const total = netAmount - discountAmount;

  // Fetch tests on component mount
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

  // Filter tests from frontend
  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Re-validate discountValue when selectedTests or discountType changes
  useEffect(() => {
    trigger("discountValue");
  }, [watch("tests"), watch("discountType"), watch("discountValue"), trigger]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Custom Multi-Select Dropdown */}
      <Controller
        name="tests"
        control={control}
        rules={{ required: "Select at least one test" }}
        render={({ field }) => {
          const selectedTests = field.value
            .map((id) => tests.find((t) => t.id === id))
            .filter(Boolean);

          const toggleTest = (id) => {
            if (field.value.includes(id)) {
              field.onChange(field.value.filter((v) => v !== id));
            } else {
              field.onChange([...field.value, id]);
            }
          };

          return (
            <>
              <div className="relative mb-4" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between cursor-pointer bg-white"
                >
                  <span className="text-gray-700">
                    {selectedTests.length > 0
                      ? `${selectedTests.length} test(s) selected`
                      : "Select or search tests"}
                  </span>
                  <FaChevronDown className="text-gray-500" />
                </div>

                {dropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-64 overflow-auto">
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                    />
                    {loadingTests ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading...
                      </div>
                    ) : filteredTests.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No tests found
                      </div>
                    ) : (
                      filteredTests.map((test) => (
                        <div
                          key={test.id}
                          onClick={() => toggleTest(test.id)}
                          className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                            field.value.includes(test.id)
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                        >
                          <span>
                            {test.name} - ৳{test.price}
                          </span>
                          <input
                            type="checkbox"
                            checked={field.value.includes(test.id)}
                            readOnly
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected Test Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTests.length === 0 && (
                  <p className="text-gray-500 italic">No tests selected</p>
                )}
                {selectedTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {test.name}
                    <FaTimes
                      onClick={() => toggleTest(test.id)}
                      className="ml-2 cursor-pointer hover:text-red-300"
                      title="Remove"
                    />
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {errors.tests && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.tests.message}
                </p>
              )}

              {/* Discount Fields */}
              <div className="mt-6">
                <label
                  htmlFor="discountType"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Discount Type
                </label>
                <select
                  id="discountType"
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("discountType")}
                  defaultValue="percent"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="amount">Fixed (৳)</option>
                </select>

                <label
                  htmlFor="discountValue"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Discount Value
                </label>
                <input
                  id="discountValue"
                  type="number"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.discountValue
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  {...register("discountValue", {
                    min: { value: 0, message: "Can't be negative" },
                    validate: (value) => {
                      const val = Number(value);
                      if (isNaN(val)) return "Must be a number";

                      if (discountType === "percent" && val > 100) {
                        return "Percentage can't exceed 100%";
                      }

                      if (discountType === "amount" && val > netAmount) {
                        return "Fixed discount can't exceed total amount";
                      }

                      return true;
                    },
                  })}
                />
                {errors.discountValue && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="mt-6 border-t pt-4 text-gray-700 text-right space-y-1 text-lg font-medium">
                <div>Net Amount: ৳{netAmount.toFixed(2)}</div>
                <div>Discount: -৳{discountAmount.toFixed(2)}</div>
                <div className="text-blue-700 font-bold text-xl">
                  Total: ৳{total.toFixed(2)}
                </div>
              </div>
            </>
          );
        }}
      />
    </div>
  );
}

export default StepSelectTests;
