const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    };

    const spinner = (
        <div className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full animate-spin`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-10">
            {spinner}
        </div>
    );
};

export default Loader;