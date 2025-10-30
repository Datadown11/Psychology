// DOM 요소가 모두 로드되면 스크립트 실행
document.addEventListener('DOMContentLoaded', () => {

    // 1. 실험 조건(A/B) 분기 로직
    const urlParams = new URLSearchParams(window.location.search);
    const condition = urlParams.get('condition'); // URL에서 'condition' 값을 가져옴

    // 팝업이 3초 후에 뜨도록 설정
    setTimeout(() => {
        if (condition === 'auto') {
            showAutoPopup();
        } else if (condition === 'click') {
            showClickPopup();
        }
        // condition 값이 없거나 다르면 아무 팝업도 띄우지 않음.
    }, 3000); // 3초 딜레이


    // 2. 팝업 1: 자동 당첨 룰렛 로직
    function showAutoPopup() {
        const popup = document.getElementById('popup-auto');
        const wheel = document.getElementById('wheel-auto');
        const resultText = document.getElementById('result-auto');
        const closeBtn = document.getElementById('close-auto');

        popup.style.display = 'flex'; // 팝업 보이기
        
        // "4게임" 요청을 4초간의 애니메이션으로 구현 (CSS의 @keyframes 사용)
        wheel.classList.add('spinning-auto');

        // 4초 (애니메이션 시간) 후에 결과 표시
        setTimeout(() => {
            resultText.textContent = '축하합니다! 15% 할인 쿠폰 당첨!';
            resultText.style.display = 'block';
            closeBtn.style.display = 'inline-block'; // 닫기 버튼 보이기
        }, 4100); // 애니메이션 시간(4초) + 0.1초 딜레이

        // 닫기 버튼
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    // 3. 팝업 2: 클릭형 확정 룰렛 로직
    function showClickPopup() {
        const popup = document.getElementById('popup-click');
        const wheel = document.getElementById('wheel-click');
        const spinBtn = document.getElementById('spin-button');
        const resultText = document.getElementById('result-click');
        const closeBtn = document.getElementById('close-click');

        popup.style.display = 'flex'; // 팝업 보이기

        // 스핀 버튼 클릭 이벤트
        spinBtn.addEventListener('click', () => {
            spinBtn.disabled = true; // 버튼 비활성화 (중복 클릭 방지)

            // 룰렛 돌리기 (JS로 각도 제어)
            // 최소 5바퀴(1800deg) + 랜덤 각도
            // 실험 결과가 동일해야 하므로 '15% 쿠폰' 위치로 고정 (예: 315도)
            const randomDegrees = 1800 + 315; 
            
            wheel.style.transform = `rotate(${randomDegrees}deg)`;

            // 4초 (CSS transition 시간) 후에 결과 표시
            setTimeout(() => {
                resultText.textContent = '축하합니다! 15% 할인 쿠폰 당첨!';
                resultText.style.display = 'block';
                closeBtn.style.display = 'inline-block'; // 닫기 버튼 보이기
            }, 4100); // CSS transition 시간(4초) + 0.1초 딜레이
        });

        // 닫기 버튼
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }
});