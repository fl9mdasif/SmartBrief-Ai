import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setSelectedSummary } from "../../redux/features/summary/summarySlice";
import { useCreateSummaryMutation } from "../../redux/features/summary/summaryApi";

const SummaryForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  // Get the mutation hook from our API slice
  const [createSummary, { isLoading }] = useCreateSummaryMutation();

  const onSubmit = async (data) => {
    if (!data.prompt || data.prompt.trim() === "") {
      return alert("Please enter some text to summarize.");
    }

    try {
      // Trigger the mutation and wait for the result
      const result = await createSummary({ prompt: data.prompt }).unwrap();
      const newSummary = result.data.summary;

      // On success, clear the form
      reset();

      // And dispatch an action to select the newly created summary.
      // This will make the UI automatically switch to the SummaryDetail view.
      dispatch(setSelectedSummary(newSummary));
    } catch (err) {
      // Show an error message if the mutation fails (e.g., out of credits)
      alert(
        err.data?.message || "An error occurred while creating the summary."
      );
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Create a New Summary</h2>
        <p className="text-gray-400">
          Paste your content below and let SmartBrief do the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <label
            htmlFor="prompt"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Your Content
          </label>
          <textarea
            id="prompt"
            {...register("prompt", { required: true })}
            className="w-full flex-1 p-4 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 transition-colors"
            placeholder="Enter the text, article, or document you want to summarize..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-4 py-3 font-bold text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading
            ? "Analyzing & Summarizing..."
            : "Generate Summary & Use 1 Credit"}
        </button>
      </form>
    </div>
  );
};

export default SummaryForm;
