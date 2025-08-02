import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import useAxiosPublic from "../hooks/useAxiosPublic";

function AddTests() {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [allTests, setAllTests] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const fetchAllTests = async () => {
    try {
      const res = await axiosPublic.get("/api/v1/get-all-test");
      setAllTests(res?.data || []);
    } catch (error) {
      toast.error("Failed to load tests");
    }
  };

  useEffect(() => {
    fetchAllTests();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingTestId) {
        await axiosPublic.patch(`/api/v1/update-test/${editingTestId}`, data);
        toast.success("Test updated successfully");
      } else {
        await axiosPublic.post("/api/v1/create-test", data);
        toast.success("Test added successfully");
      }
      reset();
      setEditingTestId(null);
      fetchAllTests();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (test) => {
    setEditingTestId(test.id);
    setValue("name", test.name);
    setValue("price", test.price);
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteConfirmationText !== "delete") return;

    try {
      await axiosPublic.delete(`/api/v1/delete-test/${deleteTargetId}`);
      toast.success("Test deleted");
      fetchAllTests();
    } catch {
      toast.error("Delete failed");
    }
    setDeleteDialogOpen(false);
    setDeleteConfirmationText("");
    setDeleteTargetId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingTestId ? "Update Test" : "Add Test"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <input
          {...register("name", { required: true })}
          placeholder="Test name"
          className="border p-2 w-full rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">Name is required</p>
        )}

        <input
          type="number"
          {...register("price", { required: true })}
          placeholder="Price"
          className="border p-2 w-full rounded"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">Price is required</p>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {editingTestId ? "Update Test" : "Add Test"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">All Tests</h3>
      <div className="space-y-2">
        {allTests.length === 0 ? (
          <p className="text-gray-500">No tests available.</p>
        ) : (
          allTests.map((test) => (
            <div
              key={test.id}
              className="flex justify-between items-center border p-3 rounded hover:shadow"
            >
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="text-sm text-gray-500">${test.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(test)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p className="mb-2">
            Type <strong>delete</strong> to confirm:
          </p>
          <TextField
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            disabled={deleteConfirmationText !== "delete"}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddTests;
