## 국내 임상시험 검색창 만들기

## 기능 설명

### 디바운싱

1. 서버에 데이터를 요청하는 getSickData 함수가 최초로 호출될 때 함수 내부의 setTimeOut이 비동기로 get요청을 하는 timer를 만든다.
2. timer가 만들어진 getSickData함수가 다시 호출되면 이전에 생성된 timer를 제거하고 새로운 timer를 만든다.
3. 200밀리초 동안 getSickData함수의 호출이 없으면 마지막으로 생성된 timer만 실행된다.

```js
const GETSICK = "/sick?q=";

let timer;

const getSickData = (param = "") => {
  if (timer) {
    clearTimeout(timer);
  }

  return new Promise((resolve, reject) => {
    timer = setTimeout(async () => {
      try {
        if (param === "") {
          resolve([]);
          return;
        }
        const response = await axiosInstance.get(GETSICK + param);
        resolve(response.data);
      } catch (error) {
        if (error && error.data) {
          resolve(error.data);
        } else {
          reject(error);
        }
      }
    }, 300);
  });
};
```

### 캐싱(캐시 스토리지)

1. axios 인스턴스로 요청이 들어왔을 때 인터셉터에서 캐시스토리지의 기록과 일치하는 응답이 있는지 검색한다.
2. 캐싱된 결과가 있다면 캐싱된 결과의 expire time(1일)이 아직 지나지 않았는지 확인한다.
3. expire time이 지났다면 서버에 요청을 하고 기존의 캐싱된 결과를 삭제한다.
4. 아직 캐싱된 응답이 유효하다면 캐시스토리지의 응답을 Promise의 reject로 리턴한다.

```js
instance.interceptors.request.use(
  async function (config) {
    const result = await caches
      .match(config.url)
      .then((response) => response && response.json());

    if (!!result) {
      if (isValid(result.headers.created_date)) {
        return Promise.reject(result);
      }
      const cacheStorage = await caches.open("search");
      await cacheStorage.delete(config.url);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// ./src/api/isValid
const isValid = (createdAt) => {
  const expireTime = 86400000;
  const currentTime = Date.now();
  return currentTime - createdAt < expireTime;
};
```

5. 응답의 헤더에 created_date를 추가하여 유효성 검증할 때 현재시각과 비교할 수 있게 제작하였다.
6. 캐시스토리지는 응답을 그대로 저장할 수 있기 때문에 axios의 응답 결과를 응답 객체로 만들어서 캐싱하였다.

```js
instance.interceptors.response.use(
  async function (config) {
    if (config.data.length !== 0) {
      config.headers.created_date = Date.now();
      const cacheStorage = await caches.open("search");
      const headers = new Headers();
      headers.append("Content-Type", "application/json;charset=utf-8");
      const cacheResponse = new Response(JSON.stringify(config), {
        headers: headers,
      });

      await cacheStorage.put(config.config.url, cacheResponse);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
```

### 방향키 이벤트

1. ul 리스트의 li 노드를 모두 선택한 다음 event.key가 "ArrowDown"이면 index+1 state와 일치하는 노드에 "selected" 클래스를 추가한다. index의 "selected" 클래스는 제거한다.
2. event.key가 "ArrowUp"이면 index-1 state와 일치하는 노드에 "selected" class를 추가한다. index의 "selected" 클래스는 제거한다.
3. 데이터를 요청해서 ul 리스트가 변경되면 모든 "selected" 클래스를 제거하여 초기화한다.

```js
const inputRef = useRef();
const listRef = useRef();
const [index, setIndex] = useState(-1);

const keyDownScrollIndex = (e) => {
const listNode = listRef.current;
const itemNode = listNode?.querySelectorAll("ul > li");
if (e.key === "ArrowDown") {
  e.preventDefault();
  setIndex((prev) => (prev < itemNode?.length - 1 ? prev + 1 : prev));
  itemNode && itemNode[index - 1]?.classList.remove("selected");
  itemNode && itemNode[index]?.classList.add("selected");
} else if (e.key === "ArrowUp") {
  e.preventDefault();
  setIndex((prev) => (prev > 1 ? prev - 1 : prev));
  itemNode && itemNode[index]?.classList.remove("selected");
  itemNode && itemNode[index - 1]?.classList.add("selected");
} else {
  inputRef.current.focus();
}
};

useEffect(() => {
  getSickData(query)
    .then(async (result) => {
      setIndex(-1);
      const listNode = listRef.current;
      const itemNode = listNode?.getElementsByClassName("selected");
      itemNode &&
        Array.from(itemNode).forEach((element) => {
          element.classList.remove("selected");
        });
    })
    .catch((err) => {/*생략*/});
  }, [searchWord]);

return (
  <SearchInputWrapper>
    <Icon size="25px" />
    <SearchWordInput
      onKeyDown={keyDownScrollIndex}
      ref={inputRef}
      value={searchWord}
      onChange={changeSearchWord}
      placeholder="질환명을 입력해주세요"
    />
  </SearchInputWrapper>

    (searchResult.length !== 0 ? (
          <SearchResultContainer ref={listRef}>
          {/* 생략 */}
          </SearchResultContainer>
        ) : (
          <SearchResultContainer>검색어 없음</SearchResultContainer>)
    );
)
```
