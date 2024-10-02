import React from 'react';
import styled from 'styled-components';

interface SortProps {
    onSort: (sortType: string) => void; // Sorting function
    sortOrder: 'asc' | 'desc'; // Sort order type
    toggleSortOrder: () => void; // Function to toggle sort order
}

const Sort: React.FC<SortProps> = ({onSort, sortOrder, toggleSortOrder}) => {
    return (
        <Container>
            <SortSelect onChange={(e) => onSort(e.target.value)}>
                <option value="" disabled hidden>Sort by</option>
                <option value="date">Date</option>
                <option value="price">Price</option>
            </SortSelect>
            <SortButton onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? '⬆️' : '⬇️'}
            </SortButton>
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const SortSelect = styled.select`
  padding: 12px;
  -webkit-appearance: none;
`;

const SortButton = styled.button`
  padding: 10px;
`;

export default Sort;