async function get1(bno) {
    const result = await axios.get(`/replies/list/${bno}`)
    // console.log("서버로 부터 응답 받은 result 확인 : " , result)
    // return result.data
    return result
}

// 댓글 목록을 출력하는 함수.
// 비유 : 동기 함수,
// 손님1 : 커피 주문, , 직원 : 주문 받고, 커피 만들기, 받을 때 까지 대기.
// 그동안, 손님1은 그 앞에서 대기, 다른 손님들은 주문을 못하고 줄을 서서 기다립니다.
// 손님1이 커피 완성이 되면,
// 그다음에
// 손님2 번이 주문 가능함.

// 비유,: 비동기함수는,
// 카페에서,
// 손님1번 커피 주문함. 직원 : 진동벨을 전달 해줌..
// 직원 : 다시 다른 손님의 주문을 받음.
// 손님 2번 커피 주문함. 직원 : 진동벨을 전달 해줌..

// 결론, 클라이언트가, 서버에게 데이터를 요청하면,
// 기다림 + 진동벨을 들고 기다림, -> 서버가 데이터를 다 만들어서 전달해줌.
// 클라이언트 데이터를 받으면 됨.
async function getList({bno, page, size, goLast}){
    const result = await axios.get(`/replies/list/${bno}`,
        {params : {page,size}})

    // 댓글의 마지막 가는 여부를 체크해서, 가장 맨끝에 바로가기,
    if(goLast) {
        const total = result.data.total
        const lastPage = parseInt(Math.ceil(total/size))
        return getList({bno:bno,page:lastPage, size:size})
    }

    return result.data
}

// 댓글 작성.
async function addReply(replyObj) {
    const response = await axios.post(`/replies/`, replyObj)
    return response.data

}

// 댓글 하나 조회.
async function getReply(rno) {
    const response = await axios.get(`/replies/${rno}`)
    return response.data
}

// 댓글 수정
async function modifyReply (replyObj) {
    const response = await axios.put(`/replies/${replyObj.rno}`, replyObj)
    return response.data
}

// 댓글 삭제
async function removeReply (rno) {
    const response = await axios.delete(`/replies/${rno}`)
    return response.data
}

document.addEventListener('DOMContentLoaded', () => {
    // 기존 버튼 및 정보 영역
    const weatherButton = document.getElementById('weatherButton');
    const foodButton = document.getElementById('foodButton');
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const foodInfoDiv = document.getElementById('foodInfo');

    // 새로 추가된 네이버 맛집 버튼 및 정보 영역
    const naverFoodButton = document.getElementById('naverFoodButton');
    const naverFoodListDiv = document.getElementById('naverFoodList');

    // 모든 정보창을 숨기는 헬퍼 함수
    const hideAllInfoDivs = () => {
        weatherInfoDiv.style.display = 'none';
        foodInfoDiv.style.display = 'none';
        naverFoodListDiv.style.display = 'none';
    };

    // 기존 날씨 버튼 클릭 이벤트
    if (weatherButton) {
        weatherButton.addEventListener('click', () => {
            hideAllInfoDivs(); // 다른 정보창 숨기기
            fetch('http://localhost:8080/api/weather')
                .then(response => response.json())
                .then(data => {
                    if (data.main && data.weather && data.weather.length > 0) {
                        const description = data.weather[0].description;
                        const temp = data.main.temp;
                        const feelsLike = data.main.feels_like;
                        const humidity = data.main.humidity;
                        weatherInfoDiv.innerHTML = `
                            <p><strong>현재 부산 날씨:</strong> ${description}</p>
                            <p><strong>온도:</strong> ${temp}°C (체감: ${feelsLike}°C)</p>
                            <p><strong>습도:</strong> ${humidity}%</p>
                        `;
                    } else if (data.error) {
                        weatherInfoDiv.innerHTML = `<p style="color: red;">에러: ${data.error}</p>`;
                    } else {
                        weatherInfoDiv.innerHTML = `<p style="color: red;">날씨 정보를 찾을 수 없습니다.</p>`;
                    }
                    weatherInfoDiv.style.display = 'block';
                })
                .catch(error => {
                    console.error('날씨 정보를 가져오는데 실패했어요:', error);
                    weatherInfoDiv.innerHTML = `<p style="color: red;">날씨 정보를 가져오지 못했습니다. 서버 상태를 확인해주세요.</p>`;
                    weatherInfoDiv.style.display = 'block';
                });
        });
    }

    // 기존 공공데이터 맛집 버튼 클릭 이벤트
    if (foodButton) {
        foodButton.addEventListener('click', () => {
            hideAllInfoDivs(); // 다른 정보창 숨기기
            fetch('http://localhost:8080/api/food/busan')
                .then(response => response.json())
                .then(data => {
                    const foodItems = data;
                    if (foodItems && Array.isArray(foodItems) && foodItems.length > 0) {
                        let foodListHtml = '<table><thead><tr><th>이름</th><th>주소</th><th>전화번호</th></tr></thead><tbody>';
                        foodItems.forEach(foodPlace => {
                            const name = foodPlace.UC_RSTRNT_NM || foodPlace.name || '정보 없음';
                            const address = foodPlace.ADDR || foodPlace.address || '정보 없음';
                            const phone = foodPlace.TLNO || foodPlace.phone || '정보 없음';
                            foodListHtml += `
                                <tr><td>${name}</td><td>${address}</td><td>${phone}</td></tr>
                            `;
                        });
                        foodListHtml += '</tbody></table>';
                        foodInfoDiv.innerHTML = foodListHtml;
                    } else {
                        foodInfoDiv.innerHTML = `<p>공공데이터 맛집 정보를 찾을 수 없거나 데이터가 비어있습니다.</p>`;
                    }
                    foodInfoDiv.style.display = 'block';
                })
                .catch(error => {
                    console.error('공공데이터 맛집 정보를 가져오는데 실패했어요:', error);
                    foodInfoDiv.innerHTML = `<p style="color: red;">공공데이터 맛집 정보를 가져오지 못했습니다. 서버 상태를 확인해주세요.</p>`;
                    foodInfoDiv.style.display = 'block';
                });
        });
    }

    // 새로 추가된 네이버 맛집 버튼 토글 기능 (최초 클릭 시만 API 호출, 이후에는 토글만)
    if (naverFoodButton) {
        let naverFoodLoaded = false;
        let naverFoodVisible = false;
        naverFoodButton.addEventListener('click', () => {
            if (!naverFoodVisible) {
                hideAllInfoDivs(); // 다른 정보창 숨기기
                if (!naverFoodLoaded) {
                    fetch('http://localhost:8080/api/naver/food')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            const naverFoodItems = data.items;
                            if (naverFoodItems && Array.isArray(naverFoodItems) && naverFoodItems.length > 0) {
                                let foodListHtml = '<h4>부산 맛집 (네이버 검색)</h4>';
                                naverFoodItems.forEach(item => {
                                    const name = item.title.replace(/<b>/g, '').replace(/<\/b>/g, '') || '정보 없음';
                                    const category = item.category || '카테고리 없음';
                                    const address = item.address || '주소 없음';
                                    const tel = item.telephone || '전화번호 없음';
                                    const link = item.link || '#';
                                    foodListHtml += `
                                        <div class="food-item">
                                            <strong><a href="${link}" target="_blank">${name}</a></strong>
                                            <p>카테고리: ${category}</p>
                                            <p>주소: ${address}</p>
                                            <p>전화: ${tel}</p>
                                        </div>
                                    `;
                                });
                                naverFoodListDiv.innerHTML = foodListHtml;
                            } else if (data.error) {
                                naverFoodListDiv.innerHTML = `<p style=\"color: red;\">에러: ${data.error}</p>`;
                            } else {
                                naverFoodListDiv.innerHTML = `<p>네이버 부산 맛집 정보를 찾을 수 없거나 데이터가 비어있습니다.</p>`;
                            }
                            naverFoodListDiv.style.display = 'block';
                            naverFoodLoaded = true;
                            naverFoodVisible = true;
                        })
                        .catch(error => {
                            console.error('네이버 맛집 정보를 가져오는데 실패했어요:', error);
                            naverFoodListDiv.innerHTML = `<p style=\"color: red;\">네이버 맛집 정보를 가져오지 못했습니다. 서버 상태를 확인해주세요.</p>`;
                            naverFoodListDiv.style.display = 'block';
                            naverFoodLoaded = true;
                            naverFoodVisible = true;
                        });
                } else {
                    naverFoodListDiv.style.display = 'block';
                    naverFoodVisible = true;
                }
            } else {
                naverFoodListDiv.style.display = 'none';
                naverFoodVisible = false;
            }
        });
    }
});