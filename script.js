document.addEventListener("DOMContentLoaded", function () {
  // =========================================================
  // 필수 기능 A. 글자 수 계산기
  // =========================================================
  const charInput = document.querySelector("#charInput");
  const excludeSpaceCheckbox = document.querySelector("#excludeSpaceCheckbox");
  const charResetBtn = document.querySelector("#charResetBtn");
  const charResult = document.querySelector("#charResult");

  // 글자 수 계산 및 화면 업데이트 함수
  function updateCharCount() {
    const rawText = charInput.value;
    let count = 0;

    if (excludeSpaceCheckbox.checked) {
      // 공백(스페이스, 탭, 줄바꿈 등 모든 공백 문자) 제거 후 길이 계산
      const textWithoutSpaces = rawText.replace(/\s/g, "");
      count = textWithoutSpaces.length;
    } else {
      // 공백 포함 전체 길이 계산
      count = rawText.length;
    }

    charResult.textContent = `${count}자`;
  }

  // 실시간 입력 이벤트 (input)
  charInput.addEventListener("input", updateCharCount);

  // 공백 제외 체크박스 상태 변경 이벤트 (change)
  excludeSpaceCheckbox.addEventListener("change", updateCharCount);

  // 초기화 버튼 클릭 이벤트 (click)
  charResetBtn.addEventListener("click", function () {
    charInput.value = "";
    excludeSpaceCheckbox.checked = false;
    charResult.textContent = "0자";
    charInput.focus();
  });


  // =========================================================
  // 필수 기능 B. D-day 계산기
  // =========================================================
  const ddayDateInput = document.querySelector("#ddayDateInput");
  const ddayResetBtn = document.querySelector("#ddayResetBtn");
  const ddayResult = document.querySelector("#ddayResult");

  // 한국 시간(KST, UTC+9) 기준 오늘 자정(00:00:00) Date 객체 반환 함수
  function getTodayKST() {
    const now = new Date();
    // 현재 UTC 시간에 9시간(KST 오프셋)을 더해 한국 시간 기준 년/월/일 추출
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000 + kstOffset);

    const year = kstNow.getFullYear();
    const month = kstNow.getMonth();
    const day = kstNow.getDate();

    // 시간 요소를 제거한 순수 날짜 객체 반환
    return new Date(year, month, day);
  }

  // 날짜 선택 시 D-day 계산 (change 이벤트)
  ddayDateInput.addEventListener("change", function () {
    const selectedValue = ddayDateInput.value;

    // 날짜를 선택하지 않았거나 지운 경우 예외 처리
    if (!selectedValue) {
      ddayResult.textContent = "날짜를 선택하세요";
      return;
    }

    // "YYYY-MM-DD" 문자열을 분리하여 시간 없는 순수 날짜 객체 생성
    const parts = selectedValue.split("-");
    const targetDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    const todayDate = getTodayKST();

    // 밀리초 차이를 일(Day) 단위로 변환 (1일 = 86,400,000ms)
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.round((targetDate - todayDate) / msPerDay);

    if (diffDays > 0) {
      ddayResult.textContent = `D-${diffDays}`;
    } else if (diffDays === 0) {
      ddayResult.textContent = "D-Day";
    } else {
      ddayResult.textContent = `D+${Math.abs(diffDays)}`;
    }
  });

  // D-day 초기화 버튼 클릭 이벤트
  ddayResetBtn.addEventListener("click", function () {
    ddayDateInput.value = "";
    ddayResult.textContent = "날짜를 선택하세요";
  });


  // =========================================================
  // 필수 기능 C. 랜덤 순서 정하기
  // =========================================================
  const orderInput = document.querySelector("#orderInput");
  const orderShuffleBtn = document.querySelector("#orderShuffleBtn");
  const orderResetBtn = document.querySelector("#orderResetBtn");
  const orderResult = document.querySelector("#orderResult");

  // 순서 정하기 버튼 클릭 이벤트
  orderShuffleBtn.addEventListener("click", function () {
    const rawLines = orderInput.value.split("\n");
    const names = [];

    // 빈 줄 제외 및 앞뒤 공백 정리 (동명이인은 그대로 모두 배열에 추가)
    for (let i = 0; i < rawLines.length; i++) {
      const trimmed = rawLines[i].trim();
      if (trimmed !== "") {
        names.push(trimmed);
      }
    }

    // 입력한 이름이 없는 경우 안내 메시지 표시
    if (names.length === 0) {
      orderResult.textContent = "⚠️ 이름을 한 명 이상 입력해 주세요.";
      return;
    }

    // Fisher-Yates 셔플 알고리즘을 활용한 무작위 섞기
    for (let i = names.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = names[i];
      names[i] = names[randomIndex];
      names[randomIndex] = temp;
    }

    // 1번부터 번호를 붙여 결과 문자열 생성
    let resultHTML = "";
    for (let i = 0; i < names.length; i++) {
      resultHTML += `<div><strong>${i + 1}번.</strong> ${names[i]}</div>`;
    }

    orderResult.innerHTML = resultHTML;
  });

  // 랜덤 순서 초기화 버튼 클릭 이벤트
  orderResetBtn.addEventListener("click", function () {
    orderInput.value = "";
    orderResult.textContent = "명단을 입력하고 버튼을 눌러주세요.";
    orderInput.focus();
  });
});