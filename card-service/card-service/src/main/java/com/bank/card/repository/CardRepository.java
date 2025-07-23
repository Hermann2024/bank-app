package com.bank.card.repository;

import com.bank.card.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByAccountId(Long accountId);
    Card findByNumber(String number);
} 