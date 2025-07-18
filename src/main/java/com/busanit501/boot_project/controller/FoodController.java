package com.busanit501.boot_project.controller;

import com.busanit501.boot_project.service.FoodService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 이 클래스가 REST API 요청을 처리하는 컨트롤러임을 명시
public class FoodController {

    private final FoodService foodService; // FoodService 의존성 주입

    // 생성자를 통한 의존성 주입 (스프링이 자동으로 처리)
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    /**
     * 네이버 API를 통해 부산 맛집 리스트를 제공하는 엔드포인트
     * 프론트엔드에서 /api/naver/food 경로로 요청 시 이 메서드가 실행됨
     * @return 부산 맛집 정보 (JSON 형태의 문자열)
     */
    @GetMapping(value = "/api/naver/food", produces = "application/json; charset=UTF-8")
    public String getNaverFood() {
        // "부산 맛집"으로 검색하며, 최대 100개의 결과를 가져오고 첫 번째부터 시작
        // 네이버 검색 API는 한 번의 요청으로 최대 100개까지 가져올 수 있습니다.
        // 더 많은 데이터를 원한다면 'start' 파라미터를 조절하여 여러 번 호출해야 함
        String foodData = foodService.getNaverFoodPlaces("부산 맛집", 100, 1);
        return foodData; // 프론트엔드로 JSON 데이터 반환
    }
}