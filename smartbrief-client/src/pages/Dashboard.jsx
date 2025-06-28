import React from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layout/MainLayout'; 
import SummaryDetail from '../components/summary/SummaryDetail';
import SummaryForm from '../components/summary/SummaryForm';

const Dashboard = () => {
    // We check the ID from the summary slice to decide what to render
    const { selectedSummaryId } = useSelector((state) => state.summary);

    return (
        <MainLayout>
            {/* If no summary (or 'new') is selected, show the form to create one */}
            {!selectedSummaryId || selectedSummaryId === 'new' ? (
                <SummaryForm />
            ) : (
                <SummaryDetail />
            )}
        </MainLayout>
    );
};

export default Dashboard;