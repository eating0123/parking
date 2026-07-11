package com.citypilot.parking;

import com.citypilot.parking.controllers.CommunityController;
import com.citypilot.parking.controllers.HealthController;
import com.citypilot.parking.controllers.OwnerController;
import com.citypilot.parking.controllers.ParkingController;
import com.citypilot.parking.http.ApiRouter;
import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.http.StaticFileHandler;
import com.citypilot.parking.repositories.OwnerRepository;
import com.citypilot.parking.repositories.ParkingRepository;
import com.citypilot.parking.services.BookingService;
import com.citypilot.parking.services.CommunityService;
import com.citypilot.parking.services.OwnerService;
import com.citypilot.parking.services.PricingService;
import com.citypilot.parking.services.RecommendationService;
import com.citypilot.parking.services.SearchService;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Executors;

public class CityPilotApplication {
    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "3000"));
        Path staticRoot = Paths.get(".").toAbsolutePath().normalize();

        ParkingRepository parkingRepository = new ParkingRepository();
        OwnerRepository ownerRepository = new OwnerRepository();
        PricingService pricingService = new PricingService();
        RecommendationService recommendationService = new RecommendationService(parkingRepository, pricingService);
        BookingService bookingService = new BookingService(parkingRepository, pricingService);
        SearchService searchService = new SearchService(parkingRepository);
        OwnerService ownerService = new OwnerService(ownerRepository);
        CommunityService communityService = new CommunityService(parkingRepository);

        HealthController healthController = new HealthController();
        ParkingController parkingController = new ParkingController(parkingRepository, recommendationService, bookingService, searchService);
        OwnerController ownerController = new OwnerController(ownerService);
        CommunityController communityController = new CommunityController(communityService);

        ApiRouter router = new ApiRouter();
        router.get("/api/health", healthController::health);
        router.get("/api/spots", parkingController::listSpots);
        router.get("/api/search", parkingController::searchSpots);
        router.get("/api/orders", parkingController::listOrders);
        router.post("/api/recommend", parkingController::recommend);
        router.post("/api/bookings", parkingController::createBooking);
        router.get("/api/community", communityController::listDistricts);
        router.get("/api/community/districts", communityController::listDistricts);
        router.get("/api/community/locate", communityController::locateByQuery);
        router.get("/api/community/spots", communityController::listDistrictSpots);
        router.post("/api/community/locate", communityController::locate);
        router.get("/api/owner", ownerController::getOwner);
        router.patch("/api/owner/rent-status", ownerController::updateRentStatus);
        router.post("/api/owner/spots", ownerController::createOwnerSpot);

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api", exchange -> {
            try {
                router.handle(exchange);
            } catch (Exception error) {
                error.printStackTrace();
                HttpResponses.json(exchange, 500, HttpResponses.error("internal server error"));
            }
        });
        server.createContext("/", new StaticFileHandler(staticRoot));
        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();

        System.out.println("CityPilot Java demo running at http://localhost:" + port);
    }
}
