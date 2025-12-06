import React, { useEffect, useState } from 'react';
import api from '../api';

function StoreManager() {
    const [stores, setStores] = useState([]);
    const [shopDomain, setShopDomain] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get('/stores');
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            await api.post('/stores', { shopDomain, accessToken });
            setShopDomain('');
            setAccessToken('');
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add store');
        }
    };

    const selectStore = (domain) => {
        localStorage.setItem('selectedStore', domain);
        window.location.reload(); // Reload to apply header
    };

    return (
        <div>
            <h2 className="page-title">Manage Stores</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 className="section-title">Add New Store</h3>
                {error && <p className="text-error">{error}</p>}
                <form onSubmit={handleAddStore} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Shop Domain (e.g. my-store.myshopify.com)"
                        value={shopDomain}
                        onChange={(e) => setShopDomain(e.target.value)}
                        className="input-field"
                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Admin Access Token"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="input-field"
                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                    <button type="submit" className="btn">Add Store</button>
                </form>
            </div>

            <div className="card">
                <h3 className="section-title">Your Stores</h3>
                {stores.length === 0 ? (
                    <p>No stores connected.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {stores.map((store) => (
                            <li key={store.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
                                <span>{store.shopDomain}</span>
                                <button
                                    onClick={() => selectStore(store.shopDomain)}
                                    className="btn"
                                    style={{ backgroundColor: localStorage.getItem('selectedStore') === store.shopDomain ? '#10b981' : '#4f46e5' }}
                                >
                                    {localStorage.getItem('selectedStore') === store.shopDomain ? 'Active' : 'Select'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default StoreManager;
