import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const BlogCard = ({ blog }) => {
    return (
        <Link
            to={'/blogs/' + blog.slug}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden block"
        >
            {blog.thumbnail && (
                <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                />
            )}
            <div className="p-5">
                <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full capitalize">
                    {blog.category}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-2 line-clamp-2 group-hover:text-primary-500 transition">
                    {blog.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center gap-2 mt-3">
                    <img
                        src={blog.author?.avatar || 'https://ui-avatars.com/api/?name=' + blog.author?.name + '&background=0ea5e9&color=fff&size=32'}
                        className="w-6 h-6 rounded-full object-cover"
                        alt={blog.author?.name}
                    />
                    <span className="text-xs text-gray-400">
                        {blog.author?.name} · {formatDate(blog.createdAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;