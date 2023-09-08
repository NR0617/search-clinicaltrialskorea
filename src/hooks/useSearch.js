import { useState, useEffect } from 'react';
import { getSickData } from '../api/api';

const useSearch = ({ listRef }) => {
  const [searchWord, setSearchWord] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [nodeIndex, setNodeIndex] = useState(0);

  const INITIAL_INDEX = -1;

  useEffect(() => {
    const query = searchWord.trim();

    getSickData(query)
      .then(async result => {
        result && setSearchResult(result.slice(0, 10));
        setNodeIndex(INITIAL_INDEX);
        const listNode = listRef?.current;
        const itemNode = listNode?.getElementsByClassName('selected');
        itemNode &&
          Array.from(itemNode).forEach(element => {
            element.classList.remove('selected');
          });
      })
      .catch(err => {
        console.error(err);
      });
  }, [searchWord]);

  return { searchWord, setSearchWord, searchResult, nodeIndex, setNodeIndex };
};

export default useSearch;
