document.addEventListener("copy", async (event) => {
    try {
        // 클립보드에서 텍스트 데이터를 읽음
        const clipboardData = await navigator.clipboard.readText();

        // 문자열에서 불필요한 문자(\, +, 개행 등)를 제거
        const cleanedData = cleanJSONString(clipboardData);
        // JSON 데이터인지 확인
        if (isJSON(cleanedData)) {
            // JSON을 Pretty한 형식으로 변환
            const prettyJSON = prettyFormatJSON(cleanedData);

            // 새 창을 열어 Pretty JSON HTML 렌더링
            openPrettyJSON(prettyJSON);
        } else {
            console.log("The data in the clipboard is not in JSON format.");
        }
    } catch (e) {
        console.error("An error occurred while processing the copied data:", e);
    }
});

// 문자열에서 불필요한 문자(\, +, 개행 등)를 제거하는 함수
function cleanJSONString(data) {
    // 문자열에서 \와 +, 그리고 개행 문자를 제거
    return data
        .replace(/\\+/g, "") // 역슬래시 제거
        .replace(/\+/g, "")  // + 기호 제거
        .replace(/\n/g, "")  // 개행 제거
        .replace(/\r/g, ""); // 캐리지 리턴 제거
}

// JSON 여부를 확인하는 함수
function isJSON(data) {
    try {
        JSON.parse(data);
        return true;
    } catch {
        return false;
    }
}

// JSON을 Pretty한 포맷으로 변경하는 함수
function prettyFormatJSON(data) {
    return JSON.stringify(JSON.parse(data), null, 2); // 2는 들여쓰기 스페이스
}

// Pretty JSON 데이터를 새 창에 렌더링하는 함수
function openPrettyJSON(prettyJSON) {
    // 새 창 열기
    const newWindow = window.open("", "_blank", "width=600,height=800,resizable=yes,scrollbars=yes");

    if (!newWindow) {
        console.error("**Unable to open a new window. Pop-ups may have been blocked.**");
        return;
    }

    // HTML 기본 구조 정의
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pretty JSON Viewer</title>
            <style>
                body {
                    font-family: monospace;
                    background-color: #282c34;
                    color: #ffffff;
                    margin: 0;
                    padding: 16px;
                    line-height: 1.5;
                }
                pre {
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    padding: 16px;
                    border-radius: 8px;
                    overflow: auto;
                    white-space: pre-wrap;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .header h1 {
                    font-size: 20px;
                    margin: 0;
                }
                .close-btn {
                    background-color: #ff5c5c;
                    border: none;
                    color: #ffffff;
                    padding: 8px 16px;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .close-btn:hover {
                    background-color: #ff3b3b;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>JSON Pretty Viewer</h1>
                <button class="close-btn" onclick="window.close()">닫기</button>
            </div>
            <pre>${prettyJSON}</pre>
        </body>
        </html>
    `;

    // 새 창에 HTML 삽입
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}