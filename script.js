document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('vehicleReservationForm');
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbyg7IXdiIqTrnr1qPCys5kOaf-GvSztcerl-D3IWTiVBipclr0b1_SA2D21nPZgXQs1/exec';

    // 출발 및 도착 시간 select 요소 가져오기
    const departureHourSelect = document.getElementById('departureHour');
    const arrivalHourSelect = document.getElementById('arrivalHour');

    // 00~23시 옵션 추가
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        const option1 = new Option(`${hour}시`, hour);
        const option2 = new Option(`${hour}시`, hour);
        departureHourSelect.add(option1);
        arrivalHourSelect.add(option2);
    }

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        // 날짜 및 시간 값 가져오기
        const departureDate = document.getElementById('departureDate').value;
        const departureHour = document.getElementById('departureHour').value;
        const departureMinute = document.getElementById('departureMinute').value;

        const arrivalDate = document.getElementById('arrivalDate').value;
        const arrivalHour = document.getElementById('arrivalHour').value;
        const arrivalMinute = document.getElementById('arrivalMinute').value;

        // hidden input에 ISO datetime 형식으로 저장
        document.getElementById('departureDateTime').value = `${departureDate}T${departureHour}:${departureMinute}`;
        document.getElementById('arrivalDateTime').value = `${arrivalDate}T${arrivalHour}:${arrivalMinute}`;

        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // 안내사항 동의 체크박스 유효성 검사
        if (!data.agreement) {
            alert('안내사항에 동의해야 신청할 수 있습니다.');
            return;
        }

        // Google Apps Script로 전송할 데이터에서 동의 체크박스 필드 제거
        delete data.agreement;

        try {
            const response = await fetch(webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString()
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === 'success') {
                    alert('예약 신청이 성공적으로 접수되었습니다!');
                    form.reset(); // 폼 초기화
                } else {
                    alert('예약 신청 중 오류가 발생했습니다: ' + result.message);
                }
            } else {
                alert('서버 통신 중 오류가 발생했습니다. 응답 코드: ' + response.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('네트워크 오류 또는 서버와의 통신 문제로 신청에 실패했습니다.');
        }
    });
});
