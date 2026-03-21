import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { uploadDoctorImages, uploadDoctorVideos } from '../../services/uploadService';
import { getMyDoctorProfile, deleteDoctorImage, deleteDoctorVideo } from '../../services/doctorService';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2, FiImage, FiVideo } from 'react-icons/fi';

const UploadMedia = () => {
    const [doctor, setDoctor] = useState(null);
    const [tab, setTab] = useState('images');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await getMyDoctorProfile();
            setDoctor(data.doctor);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        const formData = new FormData();
        Array.from(files).forEach((f) => formData.append('images', f));
        setUploading(true);
        try {
            await uploadDoctorImages(formData);
            toast.success('Images uploaded!');
            fetchProfile();
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleVideoUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        const formData = new FormData();
        Array.from(files).forEach((f) => formData.append('videos', f));
        setUploading(true);
        try {
            await uploadDoctorVideos(formData);
            toast.success('Videos uploaded!');
            fetchProfile();
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (url) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await deleteDoctorImage(url);
            toast.success('Image deleted');
            fetchProfile();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleDeleteVideo = async (url) => {
        if (!window.confirm('Delete this video?')) return;
        try {
            await deleteDoctorVideo(url);
            toast.success('Video deleted');
            fetchProfile();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Media</h1>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setTab('images')}
                        className={'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ' + (tab === 'images' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}
                    >
                        <FiImage size={16} /> Images ({doctor?.images?.length || 0})
                    </button>
                    <button
                        onClick={() => setTab('videos')}
                        className={'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ' + (tab === 'videos' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}
                    >
                        <FiVideo size={16} /> Videos ({doctor?.videos?.length || 0})
                    </button>
                </div>

                {tab === 'images' && (
                    <div className="space-y-5">
                        <label className="block bg-white border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl p-8 text-center cursor-pointer transition">
                            <FiUpload size={32} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 font-medium">Click to upload images</p>
                            <p className="text-gray-400 text-sm mt-1">JPG, PNG, WEBP — Max 50MB each</p>
                            {uploading && <p className="text-primary-500 text-sm mt-2 animate-pulse">Uploading...</p>}
                            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>

                        {!doctor?.images || doctor.images.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">No images uploaded yet</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {doctor.images.map((img, i) => (
                                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                                        <img src={img} alt={'img-' + i} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                                            <button
                                                onClick={() => handleDeleteImage(img)}
                                                className="opacity-0 group-hover:opacity-100 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                                            >
                                                <FiTrash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'videos' && (
                    <div className="space-y-5">
                        <label className="block bg-white border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-xl p-8 text-center cursor-pointer transition">
                            <FiUpload size={32} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 font-medium">Click to upload videos</p>
                            <p className="text-gray-400 text-sm mt-1">MP4, MOV — Max 50MB each</p>
                            {uploading && <p className="text-primary-500 text-sm mt-2 animate-pulse">Uploading...</p>}
                            <input type="file" multiple accept="video/*" onChange={handleVideoUpload} className="hidden" />
                        </label>

                        {!doctor?.videos || doctor.videos.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">No videos uploaded yet</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctor.videos.map((vid, i) => (
                                    <div key={i} className="relative group rounded-xl overflow-hidden bg-black">
                                        <video src={vid} controls className="w-full aspect-video" />
                                        <button
                                            onClick={() => handleDeleteVideo(vid)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UploadMedia;