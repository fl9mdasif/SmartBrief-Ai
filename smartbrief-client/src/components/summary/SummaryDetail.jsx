import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setSelectedSummary } from '../../redux/features/summary/summarySlice'; // We need this action
import { 
    useDeleteSummaryMutation,
    useRePromptSummaryMutation, 
    
} from '../../redux/features/summary/summaryApi';
import Spinner from '../ui/Spinner';

const SummaryDetail = () => {
    const dispatch = useDispatch();
    const summary = useSelector(state => state.summary.selectedSummaryDetails);
    
    const [deleteSummary, { isLoading: isDeleting }] = useDeleteSummaryMutation();
    const [repromptSummary, { isLoading: isReprompting }] = useRePromptSummaryMutation();
    
    const { register, handleSubmit, setValue } = useForm();

    // This useEffect hook ensures the form is always populated with the
    // content of the currently selected summary.
    useEffect(() => {
        if (summary) {
            setValue('prompt', summary.prompt);
        }
    }, [summary, setValue]);


     const [isCopied, setIsCopied] = useState(false);

     // 3. Create the function to handle the copy action
    const handleCopy = () => {
        navigator.clipboard.writeText(summary.summarizedContent);
        setIsCopied(true);
        // Reset the button text after 2 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };


    if (!summary) {
        return <div className="p-6 text-center text-gray-400">Select a summary from the history or create a new one.</div>;
    }

    const onReprompt = async (data) => {
        try {
            // Call the API. The '.unwrap()' will throw an error if it fails.
            const result = await repromptSummary({ id: summary._id, prompt: data.prompt }).unwrap();
            
            // THIS IS THE KEY:
            // After a successful re-prompt, the API returns the full updated summary.
            // We dispatch an action to update the 'selectedSummaryDetails' in our Redux store.
            const newSummaryData = result.data.summary;
            dispatch(setSelectedSummary(newSummaryData));

            // alert('Summary re-generated successfully!');

        } catch (err) {
            console.error("Re-prompt failed:", err);
            alert(err.data?.message || 'Failed to re-prompt.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this summary?')) {
            try {
                await deleteSummary(summary._id).unwrap();
                dispatch(setSelectedSummary(null)); // Clear the selection after delete
            } catch (err) {
                 alert(err.data?.message || 'Failed to delete.');
            }
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Summary Details</h2>
                <button onClick={handleDelete} disabled={isDeleting} className="text-sm font-semibold text-red-500 hover:text-red-400 disabled:opacity-50">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            {/* Form for Re-prompting - this is now our only form */}
            <form onSubmit={handleSubmit(onReprompt)} className="flex-1 flex flex-col space-y-6">
                
                {/* Box #1: The Editable Prompt */}
                <div className='flex-1 flex flex-col'>
                    <label htmlFor='prompt' className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Original Prompt (Editable)</label>
                    <textarea
                        id='prompt'
                        {...register('prompt')}
                        rows="8"
                        className="w-full flex-1 p-3 bg-slate-900 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                     <div className="mt-2 flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-slate-500 transition-colors flex items-center justify-center min-w-[210px]"
                        disabled={isReprompting}
                    >
                        {/* THIS IS THE CHANGE: Conditional Rendering */}
                        {isReprompting ? (
                            <>
                                <Spinner />
                                <span className="ml-2">Generating...</span>
                            </>
                        ) : (
                            'Re-prompt & Use 1 Credit'
                        )}
                    </button>
                </div>
                </div>

               <div className='flex-1 flex flex-col'>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">AI Generated Summary</label>
                        {/* 4. The Copy Button itself */}
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${isCopied ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300 hover:bg-slate-500'}`}
                        >
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                     </div>
                     <div className="w-full flex-1 p-3 bg-slate-700 border border-slate-600 rounded-md text-gray-200 whitespace-pre-wrap">
                        {summary.summarizedContent}
                     </div>
                </div>
            </form>
        </div>
    );
};

export default SummaryDetail;