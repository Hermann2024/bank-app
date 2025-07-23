package com.bank.card.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long accountId;

    @Column(nullable = false, unique = true)
    private String number;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private LocalDate expiration;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String holderName;

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDate getExpiration() { return expiration; }
    public void setExpiration(LocalDate expiration) { this.expiration = expiration; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getHolderName() { return holderName; }
    public void setHolderName(String holderName) { this.holderName = holderName; }
} 