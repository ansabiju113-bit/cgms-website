package com.jansuraksha.service;

import com.jansuraksha.model.Complaint;

/**
 * Strategy Pattern Interface for flexible algorithmic priority calculation.
 */
public interface PriorityCalculationStrategy {
    double calculatePriorityScore(Complaint complaint);
}
