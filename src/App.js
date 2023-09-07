import { useEffect, useState, useRef } from "react";
import { getSickData } from "./api/api";
import styled from "styled-components";
import { BiSearchAlt2 as Icon } from "react-icons/bi";
import "./App.css";

function App() {
  const inputRef = useRef();
  const listRef = useRef(null);
  const [index, setIndex] = useState(-1);

  const scrollToIndex = (e) => {
    const listNode = listRef.current;
    const itemNode = listNode?.querySelectorAll("ul > li");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      itemNode && itemNode[index - 1]?.classList.remove("selected");
      itemNode && itemNode[index]?.classList.add("selected");
      setIndex((prev) => (prev < itemNode?.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      itemNode && itemNode[index]?.classList.remove("selected");
      itemNode && itemNode[index - 1]?.classList.add("selected");
      setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else {
      inputRef.current.focus();
    }
  };

  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    getSickData(searchWord.trim())
      .then(async (result) => {
        setSearchResult(result);
        setIndex(-1);
        const listNode = listRef.current;
        const itemNode = listNode?.getElementsByClassName("selected");
        Array.from(itemNode).forEach((element) => {
          element.classList.remove("selected");
        });
        console.log(itemNode, listRef.current);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchWord]);

  const changeSearchWord = (e) => {
    setSearchWord(e.target.value);
  };

  return (
    <PageWrapper>
      <Title>국내 모든 임상시험 검색하고</Title>
      <Title>온라인으로 참여하기</Title>
      <SearchInputWrapper>
        <Icon size="25px" />
        <SearchWordInput
          onKeyUp={scrollToIndex}
          ref={inputRef}
          value={searchWord}
          onChange={changeSearchWord}
          placeholder="질환명을 입력해주세요"
        />
      </SearchInputWrapper>

      {searchWord.length !== 0 &&
        (searchResult.length !== 0 ? (
          <SearchResultContainer ref={listRef}>
            <li>
              <Icon size="25px" />
              {searchWord}
            </li>
            <p>추천검색어</p>
            {searchResult.map(
              (el) =>
                el.sickNm !== searchWord && (
                  <li key={el.sickCd}>
                    <Icon size="25px" />
                    {el.sickNm}
                  </li>
                )
            )}
          </SearchResultContainer>
        ) : (
          <SearchResultContainer>검색어 없음</SearchResultContainer>
        ))}
    </PageWrapper>
  );
}

export default App;

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
  width: 650px;
  height: fit-content;
  /* 여기 */
  background-color: white;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:focus-within {
    border: 2px lightblue solid;
  }
`;
const SearchWordInput = styled.input`
  width: 600px;
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
  width: 650px;
  height: fit-content;
  font-size: 1.1em;
  margin-top: 10px;
  margin-bottom: 30px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  line-height: 160%;
  background-color: white;
  overflow: auto;
`;
