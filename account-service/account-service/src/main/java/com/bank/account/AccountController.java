package com.bank.account;

import com.bank.account.entity.Account;
import com.bank.account.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        Optional<Account> account = accountService.findById(id);
        return account.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUserId(@PathVariable Long userId) {
        return accountService.findByUserId(userId);
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.save(account);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account account) {
        if (!accountService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        account.setId(id);
        return ResponseEntity.ok(accountService.save(account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        if (!accountService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        accountService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 