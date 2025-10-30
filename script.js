document.addEventListener('DOMContentLoaded', () => {

    // 0. 룰렛 조각(slice) HTML을 템플릿에서 복사하여 각 룰렛에 삽입
    const rouletteTemplate = document.getElementById('roulette-slices-template').innerHTML;
    document.getElementById('wheel-auto').innerHTML = rouletteTemplate;
    document.getElementById('wheel-click').innerHTML = rouletteTemplate;

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
    
    // 룰렛 조각 정의 (8조각, 45도씩)
    // 1 (5%): 22.5도
    // 3 (10%): 112.5도
    // 7 (15%): 292.5도
    const prizeLocations = {
        "5%": 22.5,
        "10%": 112.5,
        "15%": 292.5
    };
    
    // 스핀과 결과 표시를 위한 헬퍼 함수 (Promise 기반)
    function runSpin(wheel, resultText, rotation, message) {
        return new Promise(resolve => {
            // 룰렛 회전 (절대 각도로 설정)
            wheel.style.transform = `rotate(${rotation}deg)`;
            
            // 3초 (애니메이션 시간) 후에 결과 표시
            setTimeout(() => {
                resultText.innerHTML = message; // innerHTML을 사용해 <br> 태그 허용
                resultText.style.display = 'block';
                resolve(); // 스핀 완료
            }, 3100); // CSS transition 시간(3초) + 0.1초 딜레이
        });
    }

    // 대기 헬퍼 함수 (ms단위)
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // async/await를 사용하여 3회 스핀을 순차적으로 실행
    async function showAutoPopup() {
        const popup = document.getElementById('popup-auto');
        const wheel = document.getElementById('wheel-auto');
        const resultText = document.getElementById('result-auto');
        const closeBtn = document.getElementById('close-auto');

        popup.style.display = 'flex'; // 1. 팝업 보이기
        
        // 팝업이 뜬 직후(display: flex) 브라우저가 룰렛의 
        // 초기 상태를 인식할 수 있도록 아주 짧은(50ms) 딜레이를 줍니다.
        // (이것이 첫 스핀이 안 되던 버그를 수정한 핵심입니다)
        await wait(50);

        const baseSpin = 1440; // 4바퀴(1440도)를 기본으로 설정

        // --- 스핀 1 (5% 쿠폰) ---
        let rotation1 = baseSpin + prizeLocations["5%"];
        await runSpin(wheel, resultText, rotation1, "첫 번째 당첨!<br>(5% 할인 쿠폰)");
        await wait(1000); // 1초 대기
        resultText.style.display = 'none'; // 다음 스핀을 위해 메시지 숨김

        // --- 스핀 2 (10% 쿠폰) ---
        let rotation2 = (baseSpin * 2) + prizeLocations["10%"];
        await runSpin(wheel, resultText, rotation2, "두 번째 당첨!<br>(10% 할인 쿠폰)");
        await wait(1000); // 1초 대기
        resultText.style.display = 'none';

        // --- 스핀 3 (15% 쿠폰) ---
        let rotation3 = (baseSpin * 3) + prizeLocations["15%"];
        await runSpin(wheel, resultText, rotation3, "세 번째 당첨!<br>(15% 할인 쿠폰)");
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


    // 3. 팝