package com.jansuraksha.service;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.ComplaintStatus;
import com.jansuraksha.model.Urgency;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final Map<String, Complaint> complaintStore = new ConcurrentHashMap<>();
    private final StandardPriorityStrategy priorityStrategy;
    private final AtomicInteger idCounter = new AtomicInteger(1005);

    public ComplaintService(StandardPriorityStrategy priorityStrategy) {
        this.priorityStrategy = priorityStrategy;
        initSeedData();
    }

    private void initSeedData() {
        seed(new Complaint("CMP-1001", "Severe Main Road Pothole near Central Market", "Road Damage",
                "A deep 4ft pothole has formed right in front of Central Market entrance causing vehicle damage and traffic jams.",
                "Central Market Road", 10.5234, 76.2145, "W1", "Ward 1 - Green Valley",
                "U101", "Rajesh Kumar", "rajesh.kumar@gmail.com", Urgency.HIGH, ComplaintStatus.APPROVED, 18,
                "Public Works Dept (PWD)", "Initial assessment by Ward Member: Confirmed deep pothole requiring PWD asphalt patching.",
                "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600", "2026-08-01 08:30"));

        seed(new Complaint("CMP-1002", "Streetlights Outage on Temple Road", "Streetlight",
                "Five consecutive LED streetlights have been out for 3 days, making night walking hazardous for women and senior citizens.",
                "Temple Road Junction", 10.5280, 76.2190, "W1", "Ward 1 - Green Valley",
                "U102", "Anita Sharma", "anita.sharma@gmail.com", Urgency.MEDIUM, ComplaintStatus.APPROVED, 12,
                "Electrical Department", "Approved. Forwarded to Electrical Department for fuse/LED bulb replacement.",
                "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600", "2026-07-31 18:15"));

        seed(new Complaint("CMP-1003", "Contaminated Drinking Water Supply", "Water Supply",
                "Tap water supplied in Morning pipe schedule has yellowish color and muddy odor. Suspecting pipe leak.",
                "Lakeview Colony Block B", 10.5310, 76.2250, "W2", "Ward 2 - Lakeview",
                "U103", "Vikram Das", "vikram.das@gmail.com", Urgency.CRITICAL, ComplaintStatus.IN_PROGRESS, 34,
                "Water & Sanitation Dept (KWA)", "High urgency. PWD team dispatched for sample testing.",
                "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600", "2026-07-30 09:10"));

        seed(new Complaint("CMP-1004", "Overflowing Garbage Bin near High School", "Garbage",
                "Public waste dump bin hasn't been emptied in 4 days. Waste spreading on road, attracting stray animals.",
                "Government High School Gate", 10.5210, 76.2110, "W3", "Ward 3 - Market Square",
                "U104", "Meera Nair", "meera.nair@gmail.com", Urgency.HIGH, ComplaintStatus.RESOLVED, 22,
                "Sanitation & Waste Mgmt", "Sanitation vehicle cleared garbage bin and disinfected area.",
                "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600", "2026-07-29 11:40"));

        seed(new Complaint("CMP-1005", "Blocked Stormwater Drainage", "Drainage",
                "Drainage channel blocked by plastic bottles and mud. Water logging on road during rain.",
                "Station Road Corner", 10.5240, 76.2150, "W1", "Ward 1 - Green Valley",
                "U105", "Karthik Raja", "karthik.raja@gmail.com", Urgency.MEDIUM, ComplaintStatus.APPROVED, 5,
                "Unassigned", "Verified and published directly on Public Feed.",
                "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600", "2026-08-01 09:45"));
    }

    private void seed(Complaint c) {
        c.setPriorityScore(priorityStrategy.calculatePriorityScore(c));
        complaintStore.put(c.getId(), c);
    }

    public List<Complaint> getAllComplaints() {
        return complaintStore.values().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Map<String, List<Complaint>> getComplaintsGroupedByCategory() {
        return getAllComplaints().stream()
                .filter(c -> !c.isMerged())
                .collect(Collectors.groupingBy(Complaint::getCategory));
    }

    public Optional<Complaint> getComplaintById(String id) {
        return Optional.ofNullable(complaintStore.get(id));
    }

    public Complaint createComplaint(Complaint newComplaint) {
        String newId = "CMP-" + idCounter.incrementAndGet();
        newComplaint.setId(newId);
        // Direct auto-approval as requested: no admin verification required!
        newComplaint.setStatus(ComplaintStatus.APPROVED);
        newComplaint.setUpvotes(1);
        if (newComplaint.getCreatedAt() == null || newComplaint.getCreatedAt().isEmpty()) {
            newComplaint.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        if (newComplaint.getWardRemarks() == null || newComplaint.getWardRemarks().isEmpty()) {
            newComplaint.setWardRemarks("Verified and published directly on Public Feed.");
        }
        newComplaint.setPriorityScore(priorityStrategy.calculatePriorityScore(newComplaint));
        complaintStore.put(newId, newComplaint);
        return newComplaint;
    }

    public Optional<Complaint> upvote(String id) {
        Complaint c = complaintStore.get(id);
        if (c != null) {
            c.setUpvotes(c.getUpvotes() + 1);
            c.setPriorityScore(priorityStrategy.calculatePriorityScore(c));
            return Optional.of(c);
        }
        return Optional.empty();
    }

    public Optional<Complaint> updateStatus(String id, ComplaintStatus status, String remarks) {
        Complaint c = complaintStore.get(id);
        if (c != null) {
            c.setStatus(status);
            if (remarks != null && !remarks.isEmpty()) {
                c.setWardRemarks(remarks);
            }
            c.setPriorityScore(priorityStrategy.calculatePriorityScore(c));
            return Optional.of(c);
        }
        return Optional.empty();
    }

    public Optional<Complaint> assignDepartment(String id, String dept) {
        Complaint c = complaintStore.get(id);
        if (c != null) {
            c.setAssignedDepartment(dept);
            c.setStatus(ComplaintStatus.IN_PROGRESS);
            return Optional.of(c);
        }
        return Optional.empty();
    }

    public boolean mergeComplaints(String masterId, String duplicateId) {
        Complaint master = complaintStore.get(masterId);
        Complaint duplicate = complaintStore.get(duplicateId);
        if (master != null && duplicate != null && !duplicate.isMerged()) {
            duplicate.setMerged(true);
            duplicate.setMasterComplaintId(masterId);
            duplicate.setStatus(ComplaintStatus.RESOLVED);
            duplicate.setWardRemarks("Merged by AI Engine into Master Grievance #" + masterId);
            master.setUpvotes(master.getUpvotes() + duplicate.getUpvotes());
            master.getChildIds().add(duplicateId);
            master.setPriorityScore(priorityStrategy.calculatePriorityScore(master));
            return true;
        }
        return false;
    }
}
