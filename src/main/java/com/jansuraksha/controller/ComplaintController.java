package com.jansuraksha.controller;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.ComplaintStatus;
import com.jansuraksha.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Complaint>>> getGroupedByCategory() {
        return ResponseEntity.ok(complaintService.getComplaintsGroupedByCategory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        Complaint created = complaintService.createComplaint(complaint);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<Complaint> upvoteComplaint(@PathVariable String id) {
        return complaintService.upvote(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable String id,
                                                  @RequestParam ComplaintStatus status,
                                                  @RequestParam(required = false) String remarks) {
        return complaintService.updateStatus(id, status, remarks)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/department")
    public ResponseEntity<Complaint> assignDepartment(@PathVariable String id,
                                                      @RequestParam String department) {
        return complaintService.assignDepartment(id, department)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
