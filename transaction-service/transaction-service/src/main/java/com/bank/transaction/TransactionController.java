package com.bank.transaction;

import com.bank.transaction.entity.Transaction;
import com.bank.transaction.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.findById(id);
        return transaction.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccountId(@PathVariable Long accountId) {
        return transactionService.findByAccountId(accountId);
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.save(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction) {
        if (!transactionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        transaction.setId(id);
        return ResponseEntity.ok(transactionService.save(transaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        if (!transactionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        transactionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 