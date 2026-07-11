package com.citypilot.parking.services;

import com.citypilot.parking.repositories.OwnerRepository;

import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class OwnerService {
    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public Map<String, Object> getOwnerProfile() {
        return ownerRepository.getOwnerProfile();
    }

    public Map<String, Object> setRentStatus(Map<String, Object> input) {
        Object renting = input.get("renting");
        if (!(renting instanceof Boolean)) throw new IllegalArgumentException("renting must be boolean");
        return ownerRepository.updateRentStatus((Boolean) renting);
    }

    public Map<String, Object> createOwnerSpot(Map<String, Object> input) {
        Map<String, Object> spot = ownerRepository.createOwnerSpot(input);
        return object("spot", spot, "owner", ownerRepository.getOwnerProfile());
    }
}
