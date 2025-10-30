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
        
        // --- ★★★ 수정된 부분 ★★★ ---
        // 팝업이 뜬 직후(display: flex) 브라우저가 룰렛의 
        // 초기 상태를 인식할 수 있도록 아주 짧은(50ms) 딜레이를 줍니다.
        // 이 딜레이가 없으면 첫 번째 스핀 애니메이션이 생략될 수 있습니다.
        await wait(50);
        // --- ★★★ 수정 완료 ★★★ ---

        const baseSpin = 1440; // 4바퀴(1440도)를 기본으로 설정

        // --- 스핀 1 (5% 쿠폰) ---
        let rotation1 = baseSpin + prizeLocations["5%
