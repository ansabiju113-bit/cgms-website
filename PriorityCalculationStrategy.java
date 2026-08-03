package com.jansuraksha.strategy;

import com.jansuraksha.model.Complaint;

/**
 * Strategy Pattern Interface for smart prioritization of grievances.
 */
public interface PriorityCalculationStrategy {
    double calculateScore(Complaint complaint);

    /**
     * Default Implementation combining Category Urgency Weight, User Urgency Rating, and Citizen Upvotes Count.
     */
    class StandardSmartStrategy implements PriorityCalculationStrategy {
        @Override
        public double calculateScore(Complaint complaint) {
            return complaint.calculatePriorityScore();
        }
    }

    /**
     * Strategy focusing primarily on Community Impact (Upvote Weighted).
     */
    class CommunityVotingStrategy implements PriorityCalculationStrategy {
        @Override
        public double calculateScore(Complaint complaint) {
            return (complaint.getUpvotesCount() * 5.0) + (complaint.calculatePriorityScore() * 0.5);
        }
    }
}
