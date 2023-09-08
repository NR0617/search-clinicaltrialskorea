import { useRef } from 'react';
import useSearch from '../hooks/useSearch';
import styled from 'styled-components';
import { BiSearchAlt2 as Icon } from 'react-icons/bi';
import ListItemComponent from '../components/ListItem';

function Main() {
  const inputRef = useRef();
  const listRef = useRef();

  const { searchWord, setSearchWord, searchResult, nodeIndex, setNodeIndex } = useSearch(listRef);
  const changeSearchWord = e => {
    setSearchWord(e.target.value);
  };

  const handlekeyDown = e => {
    const listNode = listRef?.current;
    const itemNode = listNode?.querySelectorAll('ul > li');
    if (e?.key === 'ArrowDown') {
      e.preventDefault();
      setNodeIndex(prev => (prev < itemNode?.length - 1 ? prev + 1 : prev));
      itemNode && itemNode[nodeIndex - 1]?.classList.remove('selected');
      itemNode && itemNode[nodeIndex]?.classList.add('selected');
    } else if (e?.key === 'ArrowUp') {
      e.preventDefault();
      setNodeIndex(prev => (prev > 1 ? prev - 1 : 0));
      itemNode && itemNode[nodeIndex]?.classList.remove('selected');
      itemNode && itemNode[nodeIndex - 1]?.classList.add('selected');
    } else if (e?.key === 'Enter') {
      setSearchWord(document.getElementsByClassName('selected')[0].textContent);
    } else {
      inputRef?.current.focus();
    }
  };

  const FIRST_INDEX = 1;

  return (
    <PageWrapper>
      <Title>국내 모든 임상시험 검색하고</Title>
      <Title>온라인으로 참여하기</Title>
      <SearchInputWrapper>
        <Icon size="20px" />
        <SearchWordInput
          onKeyDown={handlekeyDown}
          ref={inputRef}
          value={searchWord}
          onChange={changeSearchWord}
          placeholder="질환명을 입력해주세요"
        />
        <SerchButton>검색</SerchButton>
      </SearchInputWrapper>
      {searchWord.length !== 0 &&
        (searchResult.length !== 0 ? (
          <SearchResultContainer ref={listRef}>
            <ListItemComponent sickNm={searchResult[0]?.sickNm} sickCd={searchResult[0]?.sickCd} />
            {searchResult.length > FIRST_INDEX && <RecommendedWord>추천검색어</RecommendedWord>}
            {searchResult.map(
              (el, idx) => idx !== 0 && <ListItemComponent sickNm={el.sickNm} key={el.sickCd} />,
            )}
          </SearchResultContainer>
        ) : (
          <SearchResultContainer>검색어 없음</SearchResultContainer>
        ))}
    </PageWrapper>
  );
}

export default Main;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  width: 100%;
  height: 100vh;
  background-color: #cae9ff;
  overflow: auto;
`;

const Title = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SearchInputWrapper = styled.div`
  margin-top: 20px;
  width: 500px;
  height: fit-content;
  background-color: white;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  &:focus-within {
    border: 2px lightblue solid;
  }
`;
const SerchButton = styled.button`
  border: none;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  background-color: #3479e1;
  color: white;
  height: 100%;
  width: 80px;
`;
const SearchWordInput = styled.input`
  width: 100%;
  height: 60px;
  border-radius: 40px;
  border: none;
  font-size: 1.1em;
  padding-left: 10px;
  padding-right: 20px;
  &:focus {
    outline: none;
  }
`;

const SearchResultContainer = styled.ul`
  border-width: 2px;
  border-radius: 10px;
  width: 500px;
  height: fit-content;
  font-size: 1.1em;
  margin-top: 10px;
  margin-bottom: 30px;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
  line-height: 200%;
  background-color: white;
  overflow: auto;
`;

const RecommendedWord = styled.p`
  font-size: 0.9em;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
  opacity: 0.6;
`;
