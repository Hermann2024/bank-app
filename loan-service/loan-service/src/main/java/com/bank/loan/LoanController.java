package com.bank.loan;

import com.bank.loan.entity.Loan;
import com.bank.loan.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/loans")
public class LoanController {
    @Autowired
    private LoanService loanService;

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {
        Optional<Loan> loan = loanService.findById(id);
        return loan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Loan> getLoansByUserId(@PathVariable Long userId) {
        return loanService.findByUserId(userId);
    }

    @PostMapping
    public Loan createLoan(@RequestBody Loan loan) {
        return loanService.save(loan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        if (!loanService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        loan.setId(id);
        return ResponseEntity.ok(loanService.save(loan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        if (!loanService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        loanService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 