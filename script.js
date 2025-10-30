document.addEventListener('DOMContentLoaded', () => {

    // 1. 실험 조건(A/B) 분기 로직
    const urlParams = new URLSearchParams(window.location.search);
    const condition = urlParams.get('condition'); 

    setTimeout(() => {
        if (condition === 'auto') {
            showAutoPopup();
        } else if (condition === 'click') {
            showClickPopup();
        }
    }, 3000); // 3초 딜레이

    
    // 2. 팝업 1: 자동 당첨 룰렛 로직 (3회 연속 당첨)
    
    // 스핀과 결과 표시를 위한 헬퍼 함수 (Promise 기반)
    function runSpin(wheel, resultText, rotation, message) {
        return new Promise(resolve => {
            // 룰렛 회전
            wheel.style.transform = `rotate(${rotation}deg)`;
            
            // 4초 (애니메이션 시간) 후에 결과 표시
            setTimeout(() => {
                resultText.innerHTML = message; // innerHTML을 사용해 <br> 태그 허용
                resultText.style.display = 'block';
                resolve(); // 스핀 완료
            }, 4100); // CSS transition 시간(4초) + 0.1초 딜레이
        });
    }

    // 1.5초간 대기하는 헬퍼 함수
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // async/await를 사용하여 3회 스핀을 순차적으로 실행
    async function showAutoPopup() {
        const popup = document.getElementById('popup-auto');
        const wheel = document.getElementById('wheel-auto');
        const resultText = document.getElementById('result-auto');
        const closeBtn = document.getElementById('close-auto');

        popup.style.display = 'flex'; // 팝업 보이기
        
        let currentRotation = 0; // 누적 회전 각도

        // --- 스핀 1 ---
        currentRotation += (1800 + 45); // 5바퀴 + 1번째 당첨 위치 (5% 쿠폰)
        await runSpin(wheel, resultText, currentRotation, "첫 번째 당첨!<br>(5% 할인 쿠폰)");
        await wait(1500); // 1.5초 대기
        resultText.style.display = 'none'; // 다음 스핀을 위해 메시지 숨김

        // --- 스핀 2 ---
        currentRotation += (1800 + 135); // 5바퀴 + 2번째 당첨 위치 (10% 쿠폰)
        await runSpin(wheel, resultText, currentRotation, "두 번째 당첨!<br>(10% 할인 쿠폰)");
        await wait(1500); // 1.5초 대기
        resultText.style.display = 'none';

        // --- 스핀 3 ---
        currentRotation += (1800 + 315); // 5바퀴 + 3번째 당첨 위치 (15% 쿠폰)
        await runSpin(wheel, resultText, currentRotation, "세 번째 당첨!<br>(15% 할인 쿠폰)");
        await wait(1000); // 1초 대기

        // --- 최종 결과 ---
        resultText.innerHTML = "축하합니다! 3연속 당첨!<br>(모든 쿠폰이 지급되었습니다)";
        resultText.style.display = 'block';
        closeBtn.style.display = 'inline-block'; // 닫기 버튼 보이기

        // 닫기 버튼
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }


    // 3. 팝업 2: 클릭형 확정 룰렛 로직 (변경 없음)
    function showClickPopup() {
        const popup = document.getElementById('popup-click');
        const wheel = document.getElementById('wheel-click');
        const spinBtn = document.getElementById('spin-button');
        const resultText = document.getElementById('result-click');
        const closeBtn = document.getElementById('close-click');

        popup.style.display = 'flex'; // 팝업 보이기

        spinBtn.addEventListener('click', () => {
            spinBtn.disabled = true; 

            // 실험 결과 통일을 위해 '15% 쿠폰' 위치로 고정 (예: 315도)
            const targetRotation = 1800 + 315; 
            
            wheel.style.transform = `rotate(${targetRotation}deg)`;

            // 4초 (CSS transition 시간) 후에 결과 표시
            setTimeout(() => {
                resultText.textContent = '축하합니다! 15% 할인 쿠폰 당첨!';
                resultText.style.display = 'block';
                closeBtn.style.display = 'inline-block'; 
            }, 4100); 
        });

        // 닫기 버튼
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }
});