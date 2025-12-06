import React, { useState } from 'react';
import api from '../api';

function Settings() {
    const [ingesting, setIngesting] = useState(false);
    const [message, setMessage] = useState('');

    const handleIngest = async () => {
        setIngesting(true);
        setMessage('');
        try {
            // Trigger real ingestion for Products and Orders
            await api.post('/ingest', { type: 'products' });
            await api.post('/ingest', { type: 'orders' });

            setMessage('Successfully synced data from Shopify!');
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error syncing data. Ensure you have selected a store.';
            setMessage(errorMsg);
            console.error(error);
        } finally {
            setIngesting(false);
        }
    };

    return (
        <div>
            <h2 className="page-title">Settings</h2>

            <div className="card">
                <h3 className="section-title">Data Ingestion</h3>
                <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                    Manually trigger data ingestion from Shopify (Simulated).
                </p>

                <button
                    onClick={handleIngest}
                    disabled={ingesting}
                    className="btn"
                >
                    {ingesting ? 'Ingesting...' : 'Sync Data Now'}
                </button>

                {message && (
                    <p className={`message ${message.includes('Error') ? 'text-error' : 'text-success'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Settings;
