package com.bank.loan.service;

import com.bank.loan.entity.Loan;
import com.bank.loan.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;

    public List<Loan> findAll() {
        return loanRepository.findAll();
    }

    public Optional<Loan> findById(Long id) {
        return loanRepository.findById(id);
    }

    public List<Loan> findByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public Loan save(Loan loan) {
        return loanRepository.save(loan);
    }

    public void deleteById(Long id) {
        loanRepository.deleteById(id);
    }
} 