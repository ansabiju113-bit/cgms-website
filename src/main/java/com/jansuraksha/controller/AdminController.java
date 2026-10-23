package com.jansuraksha.controller;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.ComplaintStatus;
import com.jansuraksha.model.MergeRecommendation;
import com.jansuraksha.service.AIMergingEngine;
import com.jansuraksha.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private static final String ADMIN_PASSWORD = "admin@cgms2024";

    private final ComplaintService complaintService;
    private final AIMergingEngine aiMergingEngine;

    public AdminController(ComplaintService complaintService, AIMergingEngine aiMergingEngine) {
        this.complaintService = complaintService;
        this.aiMergingEngine = aiMergingEngine;
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyAdmin(@RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        Map<String, Object> resp = new HashMap<>();
        if (ADMIN_PASSWORD.equals(password)) {
            resp.put("success", true);
            resp.put("role", "ADMIN");
            resp.put("message", "Super Admin access granted.");
            return ResponseEntity.ok(resp);
        }
        resp.put("success", false);
        resp.put("message", "Invalid Admin password.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        List<Complaint> list = complaintService.getAllComplaints();
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) list.size());
        stats.put("pending", list.stream().filter(c -> c.getStatus() == ComplaintStatus.SUBMITTED).count());
        stats.put("approved", list.stream().filter(c -> c.getStatus() == ComplaintStatus.APPROVED || c.getStatus() == ComplaintStatus.IN_PROGRESS).count());
        stats.put("rejected", list.stream().filter(c -> c.getStatus() == ComplaintStatus.REJECTED).count());
        stats.put("resolved", list.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED).count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/ai/duplicates")
    public ResponseEntity<List<MergeRecommendation>> scanDuplicates(@RequestParam(defaultValue = "0.40") double threshold,
                                                                    @RequestParam(defaultValue = "500") double maxDistance) {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(aiMergingEngine.findPotentialDuplicates(complaints, threshold, maxDistance));
    }

    @PostMapping("/ai/merge")
    public ResponseEntity<Map<String, Object>> mergeComplaints(@RequestParam String masterId,
                                                               @RequestParam String duplicateId) {
        boolean success = complaintService.mergeComplaints(masterId, duplicateId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", success);
        if (success) {
            resp.put("message", "Merged duplicate #" + duplicateId + " into Master #" + masterId);
            return ResponseEntity.ok(resp);
        }
        resp.put("message", "Failed to merge complaints.");
        return ResponseEntity.badRequest().body(resp);
    }
}
