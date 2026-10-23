package com.jansuraksha.service;

import com.jansuraksha.model.Complaint;
import com.jansuraksha.model.Urgency;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StandardPriorityStrategy implements PriorityCalculationStrategy {

    private static final Map<String, Double> CATEGORY_WEIGHTS = new HashMap<>();

    static {
        CATEGORY_WEIGHTS.put("Electricity", 1.5);
        CATEGORY_WEIGHTS.put("Sewage", 1.5);
        CATEGORY_WEIGHTS.put("Water Supply", 1.5);
        CATEGORY_WEIGHTS.put("Road Damage", 1.3);
        CATEGORY_WEIGHTS.put("Drainage", 1.3);
        CATEGORY_WEIGHTS.put("Tree Removal", 1.2);
        CATEGORY_WEIGHTS.put("Garbage", 1.2);
        CATEGORY_WEIGHTS.put("Streetlight", 1.1);
        CATEGORY_WEIGHTS.put("Public Toilet", 1.1);
        CATEGORY_WEIGHTS.put("Others", 1.0);
    }

    @Override
    public double calculatePriorityScore(Complaint c) {
        double baseWeight = CATEGORY_WEIGHTS.getOrDefault(c.getCategory(), 1.0);
        double mult = 1.0;
        if (c.getUrgency() == Urgency.CRITICAL) mult = 2.0;
        else if (c.getUrgency() == Urgency.HIGH) mult = 1.5;
        else if (c.getUrgency() == Urgency.MEDIUM) mult = 1.2;
        else if (c.getUrgency() == Urgency.LOW) mult = 1.0;

        double score = (baseWeight * mult * 10.0) + (c.getUpvotes() * 2.5);
        return Math.round(score * 10.0) / 10.0;
    }
}
