package com.busanit501.boot_project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets; // 문자 인코딩
import org.springframework.http.converter.StringHttpMessageConverter;

@Service
public class FoodService {

    // application.properties에서 네이버 Client ID와 Secret 값을 주입받음
    @Value("${naver.api.client.id}")
    private String naverClientId;

    @Value("${naver.api.client.secret}")
    private String naverClientSecret;

    // 네이버 지역 검색 API의 기본 URL
    private final String NAVER_SEARCH_API_URL = "https://openapi.naver.com/v1/search/local.json";

    // API 호출에 사용할 RestTemplate
    private final RestTemplate restTemplate;

    public FoodService() {
        this.restTemplate = new RestTemplate();
        // 한글 깨짐 방지: UTF-8 인코딩 명시
        this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }

    /**
     * 네이버 지역 검색 API를 호출하여 부산 맛집 정보를 가져옵니다.
     * @param query 검색어 (예: "부산 맛집")
     * @param display 검색 결과 수 (1~100)
     * @param start 검색 시작 위치 (1~1000)
     * @return API 응답 (JSON 형태의 문자열)
     */
    public String getNaverFoodPlaces(String query, int display, int start) {
        // URIComponentsBuilder를 사용하여 안전하게 URL과 파라미터를 구성
        // query 파라미터(검색어)에 한글이 들어가므로 반드시 인코딩 필요
        URI uri = UriComponentsBuilder.fromUriString(NAVER_SEARCH_API_URL)
                .queryParam("query", query)
                .queryParam("display", display)
                .queryParam("start", start)
                .build()
                .encode(StandardCharsets.UTF_8) // URL 인코딩 수행
                .toUri();

        // 네이버 API는 Client ID와 Client Secret을 HTTP 헤더에 담아 보내야 함
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", naverClientId);
        headers.set("X-Naver-Client-Secret", naverClientSecret);
        headers.set("Accept-Charset", "UTF-8");
        headers.set("Accept", "application/json");

        // 헤더를 포함한 HTTP 요청 엔티티 생성
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // API 호출 및 응답 받아오기
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
            // Content-Type 명시적으로 UTF-8로 지정
            return response.getBody(); // 응답 본문(JSON 문자열) 반환
        } catch (Exception e) {
            System.err.println("네이버 맛집 정보 가져오기 실패: " + e.getMessage());
            e.printStackTrace(); // 에러 발생 시 스택 트레이스 출력 (디버깅용)
            // 에러 발생 시 프론트엔드에 전달할 에러 메시지
            return "{\"error\": \"네이버 맛집 정보를 가져오지 못했습니다.\"}";
        }
    }
}