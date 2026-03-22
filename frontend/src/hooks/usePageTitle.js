import { useEffect } from 'react';

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title
            ? title + ' | Dr. Aninda Datta'
            : 'Dr. Aninda Datta | Telemedicine';
    }, [title]);
};

export default usePageTitle;