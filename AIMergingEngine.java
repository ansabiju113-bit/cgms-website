package com.jansuraksha.service;

import com.jansuraksha.model.Complaint;
import java.util.*;

/**
 * AI-Powered Complaint Merging Engine.
 * Identifies duplicate or highly similar grievances using intelligent text token matching
 * and geographic location proximity. Consolidates votes into a master complaint to save authority workload.
 */
public class AIMergingEngine {

    private double similarityThreshold;
    private double maxGeoDistanceMeters;

    public AIMergingEngine(double similarityThreshold, double maxGeoDistanceMeters) {
        this.similarityThreshold = similarityThreshold; // e.g. 0.65 (65% text overlap)
        this.maxGeoDistanceMeters = maxGeoDistanceMeters; // e.g. 500 meters radius
    }

    public static class MergeRecommendation {
        private Complaint targetComplaint;
        private Complaint existingMasterComplaint;
        private double textSimilarityScore;
        private double distanceMeters;

        public MergeRecommendation(Complaint target, Complaint master, double textSim, double distance) {
            this.targetComplaint = target;
            this.existingMasterComplaint = master;
            this.textSimilarityScore = textSim;
            this.distanceMeters = distance;
        }

        public Complaint getTargetComplaint() { return targetComplaint; }
        public Complaint getExistingMasterComplaint() { return existingMasterComplaint; }
        public double getTextSimilarityScore() { return textSimilarityScore; }
        public double getDistanceMeters() { return distanceMeters; }
    }

    /**
     * Finds candidate master complaints for a newly submitted grievance.
     */
    public List<MergeRecommendation> findPotentialDuplicates(Complaint newComplaint, List<Complaint> existingComplaints) {
        List<MergeRecommendation> matches = new ArrayList<>();

        for (Complaint existing : existingComplaints) {
            // Ignore self or complaints from different wards/categories
            if (existing.getId().equals(newComplaint.getId()) ||
                existing.isMerged() ||
                !existing.getWardId().equals(newComplaint.getWardId()) ||
                !existing.getCategory().equalsIgnoreCase(newComplaint.getCategory())) {
                continue;
            }

            double textSim = calculateJaccardSimilarity(
                newComplaint.getTitle() + " " + newComplaint.getDescription(),
                existing.getTitle() + " " + existing.getDescription()
            );

            double distance = calculateHaversineDistance(
                newComplaint.getLatitude(), newComplaint.getLongitude(),
                existing.getLatitude(), existing.getLongitude()
            );

            if (textSim >= similarityThreshold || distance <= maxGeoDistanceMeters) {
                matches.add(new MergeRecommendation(newComplaint, existing, textSim, distance));
            }
        }

        // Sort by highest similarity
        matches.sort((a, b) -> Double.compare(b.getTextSimilarityScore(), a.getTextSimilarityScore()));
        return matches;
    }

    /**
     * Executes automatic merge of target complaint into master complaint.
     */
    public boolean autoMerge(Complaint target, Complaint master) {
        if (target != null && master != null && !target.isMerged()) {
            target.mergeInto(master);
            return true;
        }
        return false;
    }

    // Jaccard similarity score between 0.0 and 1.0
    private double calculateJaccardSimilarity(String text1, String text2) {
        Set<String> set1 = new HashSet<>(Arrays.asList(text1.toLowerCase().split("\\W+")));
        Set<String> set2 = new HashSet<>(Arrays.asList(text2.toLowerCase().split("\\W+")));

        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }

    // Geo-distance in meters using Haversine formula
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
