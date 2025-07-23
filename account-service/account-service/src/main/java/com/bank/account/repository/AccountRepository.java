package com.bank.account.repository;

import com.bank.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);
    Account findByIban(String iban);
} 