package com.jansuraksha;

import com.jansuraksha.model.*;
import com.jansuraksha.service.AIMergingEngine;
import com.jansuraksha.strategy.PriorityCalculationStrategy;

import java.util.*;

/**
 * Main Execution class demonstrating Jan-Suraksha OOP domain logic,
 * user roles, smart prioritization, upvoting, and AI merging.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("===================================================================");
        System.out.println("  JAN-SURAKSHA: CITIZEN GRIEVANCE MANAGEMENT SYSTEM (JAVA OOP ENGINE)");
        System.out.println("===================================================================\n");

        // 1. Initialize Users (Polymorphism)
        User citizen1 = new Citizen("U101", "Rajesh Kumar", "rajesh@gmail.com", "9876543210", "W1");
        User citizen2 = new Citizen("U102", "Anita Sharma", "anita@gmail.com", "9876543211", "W1");
        User wardMember = new WardMember("U201", "Suresh Menon", "suresh@panchayat.gov.in", "9876543212", "W1", "Ward 1 - Green Valley");
        User president = new PanchayathPresident("U301", "K. V. Ramanathan", "president@panchayat.gov.in", "9876543213", "Anandapuram Panchayath");
        User admin = new Administrator("U401", "System SuperAdmin", "admin@panchayat.gov.in", "9876543214", "SuperAdmin");

        System.out.println("--- User Roles Initialized ---");
        System.out.println(citizen1 + " -> " + citizen1.getDashboardAccessLevel());
        System.out.println(wardMember + " -> " + wardMember.getDashboardAccessLevel());
        System.out.println(president + " -> " + president.getDashboardAccessLevel());
        System.out.println(admin + " -> " + admin.getDashboardAccessLevel());

        // 2. Submit Grievance
        System.out.println("\n--- Citizen 1 Files Complaint ---");
        Complaint c1 = new Complaint(
            "CMP-1001",
            "Severe Main Road Pothole near Central Market",
            "Road Damage",
            "Deep pothole causing vehicle damage and traffic jams",
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",
            "Central Market Road", 10.5234, 76.2145,
            "W1", "Ward 1 - Green Valley", citizen1.getId(), citizen1.getName(), Complaint.Urgency.HIGH
        );
        System.out.println("Complaint #" + c1.getId() + " created. Initial Status: " + c1.getStatus());

        // 3. Citizen 2 Upvotes Complaint
        System.out.println("\n--- Citizen 2 Upvotes Complaint #" + c1.getId() + " ---");
        c1.addUpvote();
        c1.addUpvote();
        System.out.println("Upvote Count: " + c1.getUpvotesCount());

        // 4. Calculate Smart Priority Score
        PriorityCalculationStrategy strategy = new PriorityCalculationStrategy.StandardSmartStrategy();
        System.out.println("Calculated Priority Score: " + strategy.calculateScore(c1));

        // 5. Ward Member Assessment
        System.out.println("\n--- Ward Member Review ---");
        c1.updateStatus(Complaint.Status.APPROVED, "Field verified by Ward Member. Pothole is 4 feet wide.");
        System.out.println("Updated Status: " + c1.getStatus() + " | Remarks: " + c1.getWardRemarks());

        // 6. Panchayath President Assigns Department
        System.out.println("\n--- Panchayath President Action ---");
        c1.assignDepartment("Public Works Department (PWD)");
        System.out.println("Assigned Department: " + c1.getAssignedDepartment() + " | Status: " + c1.getStatus());

        // 7. AI Merging Engine Test
        System.out.println("\n--- AI Complaint Merging Engine Execution ---");
        Complaint c2 = new Complaint(
            "CMP-1002",
            "Large Pothole in Central Market Road",
            "Road Damage",
            "Deep pothole near market main entrance causing traffic risk",
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",
            "Central Market Entrance", 10.5238, 76.2148,
            "W1", "Ward 1 - Green Valley", citizen2.getId(), citizen2.getName(), Complaint.Urgency.MEDIUM
        );

        AIMergingEngine merger = new AIMergingEngine(0.40, 300);
        List<AIMergingEngine.MergeRecommendation> duplicates = merger.findPotentialDuplicates(c2, List.of(c1));

        for (AIMergingEngine.MergeRecommendation rec : duplicates) {
            System.out.printf("Match Found! Duplicate [CMP-%s] matches Master [CMP-%s] with Text Similarity: %.2f%% and Distance: %.1fm%n",
                rec.getTargetComplaint().getId(), rec.getExistingMasterComplaint().getId(),
                rec.getTextSimilarityScore() * 100, rec.getDistanceMeters());
            
            merger.autoMerge(rec.getTargetComplaint(), rec.getExistingMasterComplaint());
            System.out.println("Auto-Merged Duplicate! Consolidated Master Upvotes: " + rec.getExistingMasterComplaint().getUpvotesCount());
        }

        System.out.println("\n===================================================================");
        System.out.println("  JAVA OOP DOMAIN ENGINE TEST COMPLETED SUCCESSFULLY.");
        System.out.println("===================================================================");
    }
}
