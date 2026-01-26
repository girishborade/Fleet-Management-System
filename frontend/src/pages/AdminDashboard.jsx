import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    UploadCloud,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    Info,
    ChevronRight,
    Loader2,
    Database
} from 'lucide-react';
import ApiService from '../services/apiService';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: 'warning', text: 'Please select an Excel file to upload.' });
            return;
        }

        setLoading(true);
        try {
            await ApiService.uploadRates(file);
            setMessage({ type: 'success', text: 'Fleet rates updated successfully! Changes are now live across the platform.' });
            setFile(null);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Upload failed: ' + (err.response?.data?.message || err.message) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <header className="flex items-center gap-4 mb-12">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
                    <Shield className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white">Admin Console</h1>
                    <p className="text-slate-500 font-medium">Control center for fleet data and global rate management</p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl"
            >
                <div className="p-1 pb-0 bg-slate-800/50 flex items-center px-8 py-4 gap-3 border-b border-slate-700">
                    <Database size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Data Management Engine v2.0</span>
                </div>

                <div className="p-8 lg:p-12">
                    <div className="mb-12">
                        <h2 className="text-2xl font-black mb-4">Core Rate Management</h2>
                        <p className="text-slate-400 leading-relaxed max-w-2xl">
                            Update the entire pricing structure by uploading our standardized Excel format.
                            This will override existing daily, weekly, and monthly rates for all vehicle categories instantly.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-primary-600 rounded-[34px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative border-2 border-dashed border-slate-800 bg-slate-900/50 rounded-[32px] p-12 text-center transition-all hover:border-indigo-500/50">
                            <form onSubmit={handleUpload}>
                                <div className="mb-8">
                                    <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
                                        <FileSpreadsheet size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-200">
                                        {file ? file.name : "Drop spreadsheet here"}
                                    </h3>
                                    <p className="text-slate-500 text-sm">Accepted format: Microsoft Excel (.xlsx)</p>
                                </div>

                                <div className="max-w-xs mx-auto space-y-4">
                                    <label className="block">
                                        <span className="sr-only">Choose file</span>
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-3 file:px-6
                                                file:rounded-xl file:border-0
                                                file:text-sm file:font-black
                                                file:bg-indigo-600 file:text-white
                                                hover:file:bg-indigo-500
                                                cursor-pointer"
                                            accept=".xlsx"
                                            onChange={(e) => {
                                                setFile(e.target.files[0]);
                                                setMessage({ type: '', text: '' });
                                            }}
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={loading || !file}
                                        className="w-full bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl"
                                    >
                                        {loading ? <Loader2 size={24} className="animate-spin" /> : "Initiate Bulk Update"}
                                        {!loading && <UploadCloud size={24} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "mt-10 p-6 rounded-3xl border flex items-start gap-4 shadow-lg",
                                message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                            )}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={24} className="flex-shrink-0" /> : <AlertCircle size={24} className="flex-shrink-0" />}
                            <div>
                                <h4 className="font-bold mb-1">{message.type === 'success' ? 'Update Succeeded' : 'Update Failed'}</h4>
                                <p className="text-sm opacity-90">{message.text}</p>
                            </div>
                        </motion.div>
                    )}

                    <div className="mt-16 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-2xl">
                            <Info className="text-indigo-400" size={24} />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            <strong className="text-slate-200">Pro-tip:</strong> All active bookings will remain unaffected by rate changes. New rates will strictly apply to searches initiated after the upload timestamp.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
