package com.bank.card;

import com.bank.card.entity.Card;
import com.bank.card.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cards")
public class CardController {
    @Autowired
    private CardService cardService;

    @GetMapping
    public List<Card> getAllCards() {
        return cardService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Card> getCardById(@PathVariable Long id) {
        Optional<Card> card = cardService.findById(id);
        return card.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/account/{accountId}")
    public List<Card> getCardsByAccountId(@PathVariable Long accountId) {
        return cardService.findByAccountId(accountId);
    }

    @PostMapping
    public Card createCard(@RequestBody Card card) {
        return cardService.save(card);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Card> updateCard(@PathVariable Long id, @RequestBody Card card) {
        if (!cardService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        card.setId(id);
        return ResponseEntity.ok(cardService.save(card));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        if (!cardService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cardService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 