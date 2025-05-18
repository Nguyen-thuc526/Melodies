import React, { useState } from 'react';
import { List, Pagination, Typography, Spin } from 'antd';

const { Text } = Typography;

const SearchResults = ({ results, pagination, loading }) => {
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [pageSize, setPageSize] = useState(pagination?.limit || 10);

  // Handle page change
  const onPageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    // Optionally: trigger fetch for new page here if backend supports it
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return <Text>No results found.</Text>;
  }

  return (
    <div className="search-results-container p-4 bg-[#231829] rounded-lg text-white">
      <List
        itemLayout="horizontal"
        dataSource={results}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={`Artist: ${item.artistName}`}
            />
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={pagination?.total || results.length}
        showSizeChanger
        onChange={onPageChange}
        onShowSizeChange={onPageChange}
        className="mt-4"
        style={{ textAlign: 'center' }}
        showTotal={(total) => `Total ${total} songs`}
      />
    </div>
  );
};

export default SearchResults;
