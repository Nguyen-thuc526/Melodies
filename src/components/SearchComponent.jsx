'use client';

import { useState, useRef, useEffect } from 'react';
import { Input, Button, Space, Tag } from 'antd';
import {
    SearchOutlined,
    CloseCircleFilled,
    HistoryOutlined,
    FireFilled,
    UserOutlined,
    PictureOutlined,
} from '@ant-design/icons';

const SearchComponent = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
    ]);

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        const trimmed = searchValue.trim();
        if (!trimmed) return;

        setIsLoading(true);

        onSearch({ title: trimmed, artist: '', genre: '' })
            .finally(() => {
                setIsLoading(false);
                setIsExpanded(false);
            });

        if (!recentSearches.includes(trimmed)) {
            setRecentSearches((prev) => [trimmed, ...prev].slice(0, 5));
        }
    };

    const handleInputChange = (e) => setSearchValue(e.target.value);
    const handleClear = () => setSearchValue('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleTagClick = (value) => {
        setSearchValue(value);
        setIsExpanded(true);
        setTimeout(() => handleSearch(), 0);
    };

    const handleRemoveRecent = (e, search) => {
        e.stopPropagation();
        setRecentSearches((prev) => prev.filter((item) => item !== search));
    };

    const dropdownContent = (
        <div className="bg-[#231829] shadow-lg border border-[#e835c230] p-4 w-90 max-h-96 overflow-auto rounded-[5px]">
            {searchValue && (
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <SearchOutlined className="text-[#e835c2] mr-2" />
                        <span className="text-white text-sm">Search for</span>
                    </div>
                    <Button
                        type="text"
                        className="w-full text-left text-white hover:bg-[#e835c220] rounded-[5px] py-2"
                        onClick={handleSearch}
                    >
                        {searchValue}
                    </Button>
                </div>
            )}

            {recentSearches.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <HistoryOutlined className="text-[#e835c2] mr-2" />
                            <span className="text-white text-sm">Recent searches</span>
                        </div>
                        <Button
                            type="text"
                            size="small"
                            className="text-[#e835c2] hover:text-[#ff69b4] hover:bg-transparent"
                            onClick={() => setRecentSearches([])}
                        >
                            Clear all
                        </Button>
                    </div>
                    <Space direction="vertical" className="w-full">
                        {recentSearches.map((search, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between w-full px-2 py-1 hover:bg-[#e835c220] rounded-[5px] cursor-pointer"
                                onClick={() => handleTagClick(search)}
                            >
                                <div className="flex items-center">
                                    <HistoryOutlined className="text-gray-400 mr-2" />
                                    <span className="text-white">{search}</span>
                                </div>
                                <CloseCircleFilled
                                    className="text-gray-400 hover:text-white"
                                    onClick={(e) => handleRemoveRecent(e, search)}
                                />
                            </div>
                        ))}
                    </Space>
                </div>
            )}
        </div>
    );

    return (
        <div ref={searchRef} className="relative">
            <div
                className={`flex items-center pr-[10px] bg-[#2c1e36] rounded-[10px] transition-all duration-300 border ${isExpanded
                        ? 'border-[#e835c2] shadow-[0_0_10px_rgba(232,53,194,0.3)]'
                        : 'border-[#e835c250]'
                    }`}
            >
                <Button
                    type="text"
                    icon={<SearchOutlined style={{ color: '#e835c2' }} />}
                    className="flex items-center justify-center h-10 w-10 ml-1"
                    onClick={() => setIsExpanded(true)}
                    disabled={isLoading}
                />

                <Input
                    placeholder="Search artists, artworks..."
                    value={searchValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsExpanded(true)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent text-white w-full"
                    style={{
                        width: isExpanded ? 240 : 180,
                        transition: 'width 0.3s ease',
                    }}
                    disabled={isLoading}
                />

                {searchValue && (
                    <Button
                        type="text"
                        icon={<CloseCircleFilled style={{ color: 'rgba(255,255,255,0.6)' }} />}
                        className="flex items-center justify-center h-8 w-8 rounded-[5px] hover:text-white"
                        onClick={handleClear}
                        disabled={isLoading}
                    />
                )}
            </div>

            {isExpanded && (
                <div
                    className="absolute top-full left-0 z-10"
                    style={{ width: isExpanded ? 282 : 222 }}
                >
                    {isLoading ? (
                        <div className="flex justify-center p-4 text-white">Loading...</div>
                    ) : (
                        dropdownContent
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
