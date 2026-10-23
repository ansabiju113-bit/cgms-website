package com.jansuraksha.service;

import com.jansuraksha.model.*;
import com.jansuraksha.repository.ComplaintRepository;
import com.jansuraksha.repository.NotificationRepository;
import com.jansuraksha.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Layer executing transactional business operations over the SQL Database.
 */
@Service
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final StandardPriorityStrategy priorityStrategy;

    public ComplaintService(ComplaintRepository complaintRepository,
                            UserRepository userRepository,
                            NotificationRepository notificationRepository,
                            StandardPriorityStrategy priorityStrategy) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.priorityStrategy = priorityStrategy;
    }

    @PostConstruct
    public void seedDatabaseIfEmpty() {
        if (complaintRepository.count() == 0) {
            System.out.println("Seeding initial relational SQL data into database...");

            // Seed Users
            userRepository.save(new Citizen("U101", "Rajesh Kumar", "rajesh.kumar@gmail.com", "W1", "Ward 1 - Green Valley", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"));
            userRepository.save(new WardMember("U201", "Suresh Menon", "suresh.menon@panchayath.gov", "W1", "Ward 1 - Green Valley", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"));
            userRepository.save(new PanchayathPresident("U301", "K. V. Ramanathan", "president@anandapuram.gov", "Anandapuram Panchayath", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"));
            userRepository.save(new Admin("U401", "Super Admin", "admin@cgms.gov", "Master Admin Console", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"));

            // Seed Complaints
            saveSeedComplaint(new Complaint("CMP-1001", "Severe Main Road Pothole near Central Market", "Road Damage",
                    "A deep 4ft pothole has formed right in front of Central Market entrance causing vehicle damage and traffic jams.",
                    "Central Market Road", 10.5234, 76.2145, "W1", "Ward 1 - Green Valley",
                    "U101", "Rajesh Kumar", "rajesh.kumar@gmail.com", Urgency.HIGH, ComplaintStatus.APPROVED, 18,
                    "Public Works Dept (PWD)", "Initial assessment by Ward Member: Confirmed deep pothole requiring PWD asphalt patching.",
                    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600", "2026-08-01 08:30"));

            saveSeedComplaint(new Complaint("CMP-1002", "Streetlights Outage on Temple Road", "Streetlight",
                    "Five consecutive LED streetlights have been out for 3 days, making night walking hazardous for women and senior citizens.",
                    "Temple Road Junction", 10.5280, 76.2190, "W1", "Ward 1 - Green Valley",
                    "U102", "Anita Sharma", "anita.sharma@gmail.com", Urgency.MEDIUM, ComplaintStatus.APPROVED, 12,
                    "Electrical Department", "Approved. Forwarded to Electrical Department for fuse/LED bulb replacement.",
                    "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600", "2026-07-31 18:15"));

            saveSeedComplaint(new Complaint("CMP-1003", "Contaminated Drinking Water Supply", "Water Supply",
                    "Tap water supplied in Morning pipe schedule has yellowish color and muddy odor. Suspecting pipe leak.",
                    "Lakeview Colony Block B", 10.5310, 76.2250, "W2", "Ward 2 - Lakeview",
                    "U103", "Vikram Das", "vikram.das@gmail.com", Urgency.CRITICAL, ComplaintStatus.IN_PROGRESS, 34,
                    "Water & Sanitation Dept (KWA)", "High urgency. PWD team dispatched for sample testing.",
                    "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600", "2026-07-30 09:10"));

            saveSeedComplaint(new Complaint("CMP-1004", "Overflowing Garbage Bin near High School", "Garbage",
                    "Public waste dump bin hasn't been emptied in 4 days. Waste spreading on road, attracting stray animals.",
                    "Government High School Gate", 10.5210, 76.2110, "W3", "Ward 3 - Market Square",
                    "U104", "Meera Nair", "meera.nair@gmail.com", Urgency.HIGH, ComplaintStatus.RESOLVED, 22,
                    "Sanitation & Waste Mgmt", "Sanitation vehicle cleared garbage bin and disinfected area.",
                    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600", "2026-07-29 11:40"));

            saveSeedComplaint(new Complaint("CMP-1005", "Blocked Stormwater Drainage", "Drainage",
                    "Drainage channel blocked by plastic bottles and mud. Water logging on road during rain.",
                    "Station Road Corner", 10.5240, 76.2150, "W1", "Ward 1 - Green Valley",
                    "U105", "Karthik Raja", "karthik.raja@gmail.com", Urgency.MEDIUM, ComplaintStatus.APPROVED, 5,
                    "Unassigned", "Verified and published directly on Public Feed.",
                    "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600", "2026-08-01 09:45"));

            System.out.println("Initial SQL seed data inserted successfully!");
        }
    }

    private void saveSeedComplaint(Complaint c) {
        c.setPriorityScore(priorityStrategy.calculatePriorityScore(c));
        complaintRepository.save(c);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllOrderByCreatedAtDesc();
    }

    public Map<String, List<Complaint>> getComplaintsGroupedByCategory() {
        return complaintRepository.findActiveComplaints().stream()
                .collect(Collectors.groupingBy(Complaint::getCategory));
    }

    public Optional<Complaint> getComplaintById(String id) {
        return complaintRepository.findById(id);
    }

    public Complaint createComplaint(Complaint newComplaint) {
        long count = complaintRepository.count();
        String newId = "CMP-" + (1000 + count + 1);
        newComplaint.setId(newId);
        newComplaint.setStatus(ComplaintStatus.APPROVED);
        newComplaint.setUpvotes(1);
        if (newComplaint.getCreatedAt() == null || newComplaint.getCreatedAt().isEmpty()) {
            newComplaint.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        if (newComplaint.getWardRemarks() == null || newComplaint.getWardRemarks().isEmpty()) {
            newComplaint.setWardRemarks("Verified and published directly on Public Feed.");
        }
        newComplaint.setPriorityScore(priorityStrategy.calculatePriorityScore(newComplaint));

        // Save to SQL Database
        Complaint saved = complaintRepository.save(newComplaint);

        // Record Audit Notification in SQL Database
        notificationRepository.save(new Notification("N" + System.currentTimeMillis(),
                saved.getCitizenId(), saved.getId(),
                "Grievance #" + saved.getId() + " is published live on the home page!",
                "STATUS_CHANGE", "Just now"));

        return saved;
    }

    public Optional<Complaint> upvote(String id) {
        return complaintRepository.findById(id).map(c -> {
            c.setUpvotes(c.getUpvotes() + 1);
            c.setPriorityScore(priorityStrategy.calculatePriorityScore(c));
            return complaintRepository.save(c);
        });
    }

    public Optional<Complaint> updateStatus(String id, ComplaintStatus status, String remarks) {
        return complaintRepository.findById(id).map(c -> {
            c.setStatus(status);
            if (remarks != null && !remarks.isEmpty()) {
                c.setWardRemarks(remarks);
            }
            c.setPriorityScore(priorityStrategy.calculatePriorityScore(c));
            return complaintRepository.save(c);
        });
    }

    public Optional<Complaint> assignDepartment(String id, String dept) {
        return complaintRepository.findById(id).map(c -> {
            c.setAssignedDepartment(dept);
            c.setStatus(ComplaintStatus.IN_PROGRESS);
            return complaintRepository.save(c);
        });
    }

    public boolean mergeComplaints(String masterId, String duplicateId) {
        Optional<Complaint> masterOpt = complaintRepository.findById(masterId);
        Optional<Complaint> dupOpt = complaintRepository.findById(duplicateId);

        if (masterOpt.isPresent() && dupOpt.isPresent()) {
            Complaint master = masterOpt.get();
            Complaint duplicate = dupOpt.get();

            if (!duplicate.isMerged()) {
                duplicate.setMerged(true);
                duplicate.setMasterComplaintId(masterId);
                duplicate.setStatus(ComplaintStatus.RESOLVED);
                duplicate.setWardRemarks("Merged by AI Engine into Master Grievance #" + masterId);

                master.setUpvotes(master.getUpvotes() + duplicate.getUpvotes());
                master.getChildIds().add(duplicateId);
                master.setPriorityScore(priorityStrategy.calculatePriorityScore(master));

                complaintRepository.save(duplicate);
                complaintRepository.save(master);
                return true;
            }
        }
        return false;
    }
}
