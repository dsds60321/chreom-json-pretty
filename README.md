# 🚀 Pretty JSON Viewer

## 🌟 소개
**Pretty JSON Viewer**는 JSON 데이터를 보기 쉽고 활용 가능하도록 포맷해주는 크롬 확장 프로그램입니다.  
복잡한 JSON 데이터도 간단하게 정리하고, 복사하거나 팝업 창에서 확인할 수 있는 도구입니다.

---

## ✨ 주요 기능
1. 🗄️ **JSON 포맷팅**
    - 입력된 JSON 데이터를 사람이 읽기 쉽게 구조화하여 출력.
    - JSON 유효성을 검사하여 오류가 있을 경우 에러 메시지를 제공합니다.

2. 📋 **JSON 복사하기**
    - 포맷된 JSON 데이터를 버튼 클릭 한 번으로 클립보드에 저장합니다.

3. 🔍 **큰 화면에서 보기 (팝업 창)**
    - 팝업 창을 통해 포맷된 데이터를 더 보기 좋게 확인할 수 있습니다.
    - 팝업 창 제목 옆의 "복사하기" 버튼을 통해 JSON 데이터를 쉽게 클립보드에 복사할 수 있습니다.

---

## 🛠️ 설치 방법
1. 이 레포지토리를 다운로드하거나 압축 파일을 해제합니다.
2. 크롬 브라우저를 열고 `설정 → 확장 프로그램`으로 이동합니다.
3. 우측 상단에서 ✅ **"개발자 모드"**를 활성화합니다.
4. ➕ **"압축 해제된 확장 프로그램을 로드합니다"**를 클릭 후, 다운로드한 폴더를 선택합니다.
5. 플러그인이 설치되고 크롬 툴바에 확장 아이콘이 표시됩니다.

---

## 📝 사용 방법
1. 크롬 툴바에서 **Pretty JSON Viewer 아이콘**을 클릭합니다.
2. 📝 JSON 데이터를 입력란에 붙여넣습니다.
3. 🔵 **"Pretty JSON" 버튼**을 클릭하여 데이터를 정리합니다.
4. 제공된 버튼으로 아래 작업을 수행:
    - **Copy JSON**: 정리된 데이터를 클립보드에 복사합니다.
    - **View in Popup**: 별도 팝업 창에서 구조화된 JSON을 자세히 확인합니다.
        - 팝업 창 상단에서 **복사 버튼**을 통해 팝업 데이터도 클립보드에 복사 가능.

---

## 💡 기능 상세
1. **JSON 포맷 및 유효성 검사**:
    - JSON 데이터를 읽기 쉽게 정리 (2단계 들여쓰기).
    - 올바르지 않은 JSON 데이터 입력 시 오류 메시지가 출력됩니다.

2. **🌐 Popup 창 기능**:
    - `window.open`을 사용하여 별도의 팝업 창에 JSON 데이터를 표시합니다.
    - 팝업 창에서 **복사 버튼**을 클릭하여 데이터를 클립보드에 저장할 수 있습니다.

3. **📋 복사 기능**:
    - `navigator.clipboard.writeText`를 사용하여 정리된 데이터를 클립보드에 저장.
    - 성공, 실패 여부에 따라 사용자에게 메시지를 안내합니다.

---

## 🔒 권한
- **clipboardRead**: 클립보드를 읽고 복사를 위해 필요한 권한.
- **<all_urls>**: 확장이 모든 웹사이트 URL에서 작동 가능하도록 권한 설정.

---

## 🔧 기술 스택
- **HTML, CSS**: 플러그인 UI 디자인.
- **JavaScript**: JSON 데이터 처리 및 DOM 조작.
- **Chrome Extension Manifest v3**: 크롬 확장의 설정 및 환경 구성.

---

## 💻 예제

### 입력 JSON:
```json
{ key1: value1, key2: value2 }
```

### 출력 JSON:
```json
{
  "key1": "value1",
  "key2": "value2"
}
```

### 팝업 창:
- JSON 데이터가 구조화되어 표시됩니다.
- 팝업 상단 **복사 버튼**으로 데이터를 즉시 복사 가능.