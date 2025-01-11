document.addEventListener("DOMContentLoaded", () => {
    const jsonInput = document.getElementById("jsonInput");
    const outputElement = document.getElementById("output");
    const prettyButton = document.getElementById("prettyBtn");
    const copyButton = document.getElementById("copyBtn");

    // "Pretty JSON" 버튼 클릭 이벤트
    prettyButton.addEventListener("click", () => {
        const inputText = jsonInput.value.trim(); // 입력된 JSON 문자열 가져오기

        if (!inputText) {
            outputElement.innerHTML = "<p class='error'>Please enter a JSON string.</p>";
            copyButton.style.display = "none"; // 복사 버튼 숨기기
            return;
        }

        try {
            // 1. 문자열 확인 및 처리
            const formattedText = detectAndProcessJSONString(inputText);

            // 2. 키와 값 자동 수정 (필요 시)
            const fixedJSON = fixInvalidJSON(formattedText);

            // 3. Pretty JSON 변환
            const prettyJSON = prettyFormatJSON(fixedJSON);

            outputElement.innerHTML = `<pre>${prettyJSON}</pre>`; // 변환된 JSON 출력
            copyButton.style.display = "block"; // 복사 버튼 표시

            // "Copy" 버튼 클릭 이벤트 정의
            copyButton.onclick = () => { // 기존 `addEventListener` 대신 `onclick` 사용
                navigator.clipboard.writeText(prettyJSON)
                    .then(() => alert("copy completed!")) // 알림 출력
                    .catch((err) => console.error("copy fail:", err));
            };
        } catch (error) {
            // JSON 변환 실패 시
            outputElement.innerHTML = "<p class='error'>The JSON string is invalid.</p>";
            copyButton.style.display = "none"; // 복사 버튼 숨기기
        }
    });
});

// ===== detectAndProcessJSONString 수정 =====
function detectAndProcessJSONString(data) {
    // 끝에 붙은 쓸모없는 쉼표 제거
    data = removeTrailingComma(data);

    // 싱글 쿼터로 감싸진 JSON 변환
    data = convertSingleQuotesToDouble(data);

    // 이중 따옴표로 감싸진 이스케이프 JSON 확인
    if (data.startsWith('"') && data.endsWith('"')) {
        // 이중 따옴표로 감싸져 있을 경우, JSON 내부 문자열로 변환
        data = data.slice(1, -1).replace(/\\"/g, '"'); // 외부 "" 제거 및 내부 \" 처리
    }

    // + 기호로 연결된 JSON 문자열 처리
    data = preprocessConcatenatedJSON(data);

    // 불필요한 공백 및 개행 제거
    return unescapeJSONString(data);
}

// ===== 새로운 removeTrailingComma 함수 추가 =====
// JSON 문자열 끝에 불필요한 쉼표 제거
function removeTrailingComma(data) {
    // 객체에서 끝 부분의 쉼표(,})를 제거
    data = data.replace(/,\s*}/g, '}');
    // 배열에서 끝 부분의 쉼표(,])를 제거
    data = data.replace(/,\s*]/g, ']');
    return data;
}

// ===== 기존 기타 함수 =====
function convertSingleQuotesToDouble(data) {
    return data.replace(/'/g, '"');
}

function prettyFormatJSON(data) {
    const parsedJSON = JSON.parse(data);

    // JSON.stringify 함수로 JSON 포맷 수행
    return JSON.stringify(parsedJSON, (key, value) => {
        if (Array.isArray(value)) {
            // 배열일 경우 한 줄로 출력 처리
            return JSON.stringify(value);
        }
        return value; // 기본 처리
    }, 2);
}

function preprocessConcatenatedJSON(data) {
    return data.replace(/\s*\+\s*/g, '');
}

function unescapeJSONString(data) {
    return data
        .replace(/\\n/g, '')
        .replace(/\\t/g, '')
        .replace(/\\r/g, '')
        .trim();
}

function fixInvalidJSON(data) {
    const fixedData = data.replace(/([{,]\s*)([a-zA-Z가-힣0-9_]+)\s*:/g, (_, start, key) => {
        const fixedKey = `"${key}"`;
        return `${start}${fixedKey}:`;
    });

    return fixedData.replace(/:\s*([a-zA-Z가-힣_][^,{}\[\]\s]*)/g, (_, value) => {
        if (/^(true|false|null|[\[{]|[\]}]|-?\d+(\.\d+)?$)/.test(value)) {
            return `: ${value}`;
        }
        return `: "${value}"`;
    });
}

function isJSON(data) {
    try {
        JSON.parse(data);
        return true;
    } catch {
        return false;
    }
}