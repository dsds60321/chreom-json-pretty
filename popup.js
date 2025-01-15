document.addEventListener("DOMContentLoaded", () => {
    const jsonInput = document.getElementById("jsonInput");
    const outputElement = document.getElementById("output");
    const prettyButton = document.getElementById("prettyBtn");
    const copyButton = document.getElementById("copyBtn");
    const viewPopupButton = document.getElementById("viewPopupBtn");

    // "Pretty JSON" 버튼 클릭 이벤트
    prettyButton.addEventListener("click", () => {
        const inputText = jsonInput.value.trim(); // 입력된 JSON 문자열 가져오기

        clearErrorMessage(); // 기존 오류 초기화

        if (!inputText) {
            displayErrorMessage("Please enter a JSON string."); // 오류 표시
            copyButton.style.display = "none"; // 복사 버튼 숨기기
            viewPopupButton.style.display = "none"; // 복사 버튼 숨기기
            return;
        }

        try {
            // 1. JSON 문자열 정리 및 처리
            const formattedText = detectAndProcessJSONString(inputText);

            // 2. JSON 포맷 변환
            const prettyJSON = prettyFormatJSON(formattedText);

            outputElement.innerHTML = `<pre>${prettyJSON}</pre>`; // 변환된 JSON 출력
            copyButton.style.display = "block"; // 복사 버튼 표시
            viewPopupButton.style.display = "block"; // 복사 버튼 표시

            // "Copy" 버튼 클릭 이벤트 정의
            copyButton.onclick = () => {
                navigator.clipboard.writeText(prettyJSON)
                    .then(() => alert("Copy completed!"))
                    .catch((err) => console.error("Copy failed:", err));
            };

            viewPopupButton.onclick = () => openPopup(prettyJSON);
        } catch (error) {
            // JSON 변환 실패 시
            displayErrorMessage(error.message); // 오류 메시지
            copyButton.style.display = "none"; // 복사 버튼 숨기기
        }
    });
});

// popup 기능
function openPopup(prettyJSON) {
    const popupWindow = window.open("", "_blank", "width=600,height=400,scrollbars=yes");
    if (popupWindow) {
        popupWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>JSON Viewer</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 16px;
                        background-color: #282c34;
                        color: #ffffff;
                        overflow-wrap: break-word;
                        white-space: pre-wrap;
                    }
                    header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16px;
                    }
                    button {
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #45a049;
                    }
                    pre {
                        background: #1e1e1e;
                        padding: 16px;
                        border-radius: 4px;
                        overflow-x: auto;
                        font-family: monospace;
                        color: #eee;
                        max-height: 300px;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h2>Pretty JSON Viewer</h2>
                </header>
                <pre id="popupJson">${prettyJSON}</pre>
            </body>
            </html>
        `);
        popupWindow.document.close();
    } else {
        alert("Popup blocked. Please allow popups for this site.");
    }
}

// ===== 오류 메시지 처리 로직 =====
function displayErrorMessage(message) {
    const outputElement = document.getElementById("output");
    outputElement.innerHTML = `<p class='error'>${message}</p>`;
    outputElement.classList.add("error-style"); // 붉은색 오류 스타일
}

function clearErrorMessage() {
    const outputElement = document.getElementById("output");
    outputElement.classList.remove("error-style"); // 오류 스타일 제거
}

// ===== JSON 문자열 처리 =====
function detectAndProcessJSONString(data) {

    // 개행 처리
    data = data.replaceAll('\\n' , '');

    data = data.replaceAll('\\' , '');

    // 1. 문자열 양 끝에 큰따옴표 있으면 제거
    if (data.startsWith('"') && data.endsWith('"')) {
        data = data.slice(1, -1);
    }

    // 2. 싱글 쿼터를 더블 쿼터로 변환
    data = convertSingleQuotesToDouble(data);

    // 3. 키에 따옴표 추가
    data = addQuotesToKeys(data);

    // 4. 끝부분 불필요한 쉼표 제거
    data = removeTrailingComma(data);

    // 5. JSON 유효성 검사 및 반환
    return validateAndCleanJSON(data);
}

// ===== JSON 유효성 검사 및 수정 =====
function validateAndCleanJSON(data) {
    try {
        JSON.parse(data); // 기본적으로 JSON 유효성 검사
        return data; // 유효한 경우 그대로 반환
    } catch (error) {
        throw new Error(error.message);
    }
}

// ===== 키에 따옴표 추가 =====
function addQuotesToKeys(data) {
    // JSON 표준에 맞지 않는 키에 따옴표 추가 (따옴표 없는 키를 감싸기)
    return data.replace(/([{,]\s*)([a-zA-Z가-힣0-9_]+)\s*:/g, (_, start, key) => {
        const fixedKey = `"${key}"`; // 키를 더블 쿼터로 감싸기
        return `${start}${fixedKey}:`;
    });
}

// ===== JSON 포맷팅 =====
function prettyFormatJSON(data) {
    const parsedJSON = JSON.parse(data); // 파싱

    // JSON.stringify 함수로 JSON 포맷 처리
    return JSON.stringify(parsedJSON, null, 2); // 들여쓰기 포함한 구조 반환
}

// ===== 기타 문자열 처리 함수 =====
function convertSingleQuotesToDouble(data) {
    return data.replace(/'/g, '"'); // 싱글 쿼터 -> 더블 쿼터
}

function removeTrailingComma(data) {
    return data
        .replace(/,\s*}/g, '}') // 객체 내 쉼표 제거
        .replace(/,\s*]/g, ']'); // 배열 내 쉼표 제거
}