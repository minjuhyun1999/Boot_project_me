package com.busanit501.boot_project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service // 이 클래스가 서비스 계층임을 스프링에 알려줌
public class WeatherService {

    @Value("${openweathermap.api.key}") // application.properties에서 API 키 가져옴
    private String apiKey;

    private final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    // 도시 이름을 받아서 날씨 데이터를 JSON 문자열로 반환
    public String getWeather(String city) {
        RestTemplate restTemplate = new RestTemplate(); // API 호출에 사용할 도구

        // OpenWeatherMap API URL 생성 (부산은 "Busan"으로)
        // units=metric은 온도를 섭씨(°C)로 받기 위함
        String url = String.format("%s?q=%s&appid=%s&units=metric", BASE_URL, city, apiKey);

        try {
            // API 호출 및 결과 받아오기
            String result = restTemplate.getForObject(url, String.class);
            return result; // JSON 형태의 문자열 반환
        } catch (Exception e) {
            // API 호출 실패 시 에러 로깅 및 예외 처리
            System.err.println("Failed to fetch weather data for " + city + ": " + e.getMessage());
            return null; // 또는 적절한 에러 메시지 반환
        }
    }
}
