import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import InfoPageLayout from '../components/InfoPageLayout';

const HelpCenterPage = () => {
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await api.get('/content/help');
        setPageData(data);
      } catch (error) {
        console.error("Failed to load page content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <InfoPageLayout title={pageData.title || 'Help Center'}> {/* No change needed here, it's a public page. */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
      )}
    </InfoPageLayout>
  );
};

export default HelpCenterPage;