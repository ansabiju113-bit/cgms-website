package com.jansuraksha.service;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.MergeRecommendation;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AIMergingEngine {

    public double calculateJaccardSimilarity(String str1, String str2) {
        if (str1 == null || str2 == null) return 0.0;
        Set<String> set1 = tokenize(str1);
        Set<String> set2 = tokenize(str2);
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }

    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of the Earth in meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<MergeRecommendation> findPotentialDuplicates(List<Complaint> complaints, double textThreshold, double maxDistanceMeters) {
        List<MergeRecommendation> matches = new ArrayList<>();
        List<Complaint> open = complaints.stream().filter(c -> !c.isMerged()).toList();

        for (int i = 0; i < open.size(); i++) {
            for (int j = i + 1; j < open.size(); j++) {
                Complaint c1 = open.get(i);
                Complaint c2 = open.get(j);

                if (Objects.equals(c1.getCategory(), c2.getCategory()) && Objects.equals(c1.getWardId(), c2.getWardId())) {
                    double textSim = calculateJaccardSimilarity(c1.getTitle() + " " + c1.getDescription(), c2.getTitle() + " " + c2.getDescription());
                    double dist = calculateHaversineDistance(c1.getLat(), c1.getLng(), c2.getLat(), c2.getLng());

                    if (textSim >= textThreshold || dist <= maxDistanceMeters) {
                        matches.add(new MergeRecommendation(c1, c2, Math.round(textSim * 1000.0) / 10.0, Math.round(dist)));
                    }
                }
            }
        }
        return matches;
    }

    private Set<String> tokenize(String input) {
        String[] words = input.toLowerCase().split("\\W+");
        Set<String> set = new HashSet<>();
        for (String w : words) {
            if (w.length() > 2) set.add(w);
        }
        return set;
    }
}
