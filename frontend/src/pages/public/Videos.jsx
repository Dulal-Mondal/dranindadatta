import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import { getVideos } from '../../services/videoService';
import { VIDEO_CATEGORIES } from '../../utils/constants';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchVideos();
    }, [category]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const { data } = await getVideos({ category });
            setVideos(data.videos || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-gradient-to-r from-primary-500 to-blue-600 py-12 px-4 text-white text-center">
                <h1 className="text-3xl font-bold mb-2">Health Videos</h1>
                <p className="text-blue-100">Watch expert health guides and tips</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex gap-2 flex-wrap mb-8">
                    <button
                        onClick={() => setCategory('')}
                        className={'px-4 py-2 rounded-xl text-sm font-medium transition ' + (!category ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200')}
                    >
                        All
                    </button>
                    {VIDEO_CATEGORIES.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setCategory(c.value)}
                            className={'px-4 py-2 rounded-xl text-sm font-medium transition ' + (category === c.value ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200')}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {loading ? <Loader /> : videos.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No videos found</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <div key={video._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="aspect-video">
                                    <iframe
                                        src={'https://www.youtube.com/embed/' + video.youtubeId}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="p-4">
                                    <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full capitalize">{video.category}</span>
                                    <h3 className="font-semibold text-gray-800 mt-2 line-clamp-2">{video.title}</h3>
                                    {video.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Videos;