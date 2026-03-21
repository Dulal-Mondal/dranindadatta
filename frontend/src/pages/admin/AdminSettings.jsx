import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiSettings } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';

const AdminSettings = () => {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            setForm(data.settings);
        } catch {
            toast.error('Failed to load settings');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/settings', form);
            toast.success('Settings saved successfully!');
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const Field = ({ label, name, placeholder = '', type = 'text' }) => (
        <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
            <input
                type={type}
                value={form[name] || ''}
                onChange={(e) => set(name, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
        </div>
    );

    if (fetching) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <FiSettings size={24} className="text-primary-500" />
                    <h1 className="text-2xl font-bold text-gray-800">Integration Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Google Analytics ── */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">📊</span>
                            <h2 className="font-semibold text-gray-700">Google Analytics (GA4)</h2>
                        </div>
                        <Field
                            label="Measurement ID"
                            name="ga_measurement_id"
                            placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            পাবে: Google Analytics → Admin → Data Streams → তোমার stream → Measurement ID
                        </p>
                    </div>

                    {/* ── Facebook Pixel + CAPI ── */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">📘</span>
                            <h2 className="font-semibold text-gray-700">Facebook / Meta Pixel + Conversions API</h2>
                        </div>
                        <div className="space-y-3">
                            <Field
                                label="Pixel ID"
                                name="facebook_pixel_id"
                                placeholder="123456789012345"
                            />
                            <Field
                                label="Conversions API Access Token"
                                name="facebook_access_token"
                                placeholder="EAAG..."
                            />
                            <Field
                                label="Test Event Code (optional — শুধু testing এ)"
                                name="fb_test_event_code"
                                placeholder="TEST12345"
                            />
                            <Field
                                label="Site URL (event_source_url এর জন্য)"
                                name="site_url"
                                placeholder="https://medigohealthcare.com"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Access Token পাবে: Meta Business Suite → Events Manager → Pixel → Settings → Conversions API → Generate Access Token
                        </p>
                    </div>

                    {/* ── Google Ads Conversion API ── */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🎯</span>
                            <h2 className="font-semibold text-gray-700">Google Ads Conversion API</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <Field label="Client ID" name="google_ads_client_id" placeholder="xxxx.apps.googleusercontent.com" />
                            <Field label="Client Secret" name="google_ads_client_secret" placeholder="GOCSPX-..." />
                            <Field label="Developer Token" name="google_ads_developer_token" placeholder="Developer token from Google Ads API Center" />
                            <Field label="Refresh Token" name="google_ads_refresh_token" placeholder="OAuth Refresh Token" />
                            <Field label="Customer ID" name="google_ads_customer_id" placeholder="1234567890 (dash ছাড়া)" />
                            <Field label="Conversion Action ID" name="google_ads_conversion_id" placeholder="Conversion Action ID" />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            পাবে: Google Ads → Tools → API Center + Conversions section
                        </p>
                    </div>

                    {/* ── SSLCommerz ── */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">💳</span>
                            <h2 className="font-semibold text-gray-700">SSLCommerz</h2>
                        </div>
                        <div className="space-y-3">
                            <Field label="Store ID" name="ssl_store_id" placeholder="testbox" />
                            <Field label="Store Password" name="ssl_store_password" placeholder="testbox@ssl" />
                            <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="ssl_live"
                                    checked={form.ssl_is_live || false}
                                    onChange={(e) => set('ssl_is_live', e.target.checked)}
                                    className="w-4 h-4 accent-primary-500"
                                />
                                <div>
                                    <label htmlFor="ssl_live" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Live Mode
                                    </label>
                                    <p className="text-xs text-gray-400">
                                        {form.ssl_is_live
                                            ? '🔴 Live — real payment নেবে'
                                            : '🟡 Sandbox — test mode, real payment নেবে না'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><FiSave size={16} /> Save Settings</>
                        )}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;