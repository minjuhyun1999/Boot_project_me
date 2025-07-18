package com.busanit501.boot_project.controller;

import com.busanit501.boot_project.service.WeatherService; // 위에서 만든 서비스 임포트
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin; // CORS 설정을 위한 어노테이션

@RestController // 이 클래스가 REST API 요청을 처리하는 컨트롤러임을 알려줌
 @CrossOrigin(origins = "http://localhost:8080") // ★ 중요: 프론트엔드 주소에 맞춰 변경!
public class WeatherController {

    private final WeatherService weatherService; // WeatherService 주입 (Dependency Injection)

    // 생성자를 통한 의존성 주입 (스프링이 알아서 넣어줌)
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // /api/weather 경로로 GET 요청이 오면 이 메서드가 실행됨
    @GetMapping("/api/weather")
    public String getBusanWeather() {
        // WeatherService를 통해 부산 날씨 정보 가져오기
        String weatherData = weatherService.getWeather("Busan"); // "Busan" 고정

        if (weatherData != null) {
            return weatherData; // 가져온 날씨 데이터를 JSON 형태로 프론트엔드에 전달
        } else {
            // 날씨 정보를 가져오지 못했을 때 적절한 에러 메시지 반환 (JSON 형태로)
            return "{\"error\": \"Failed to retrieve weather data.\"}";
        }
    }
}
