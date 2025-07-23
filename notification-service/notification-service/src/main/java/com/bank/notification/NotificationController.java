package com.bank.notification;

import com.bank.notification.entity.Notification;
import com.bank.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.findById(id);
        return notification.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUserId(@PathVariable Long userId) {
        return notificationService.findByUserId(userId);
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.save(notification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        if (!notificationService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        notification.setId(id);
        return ResponseEntity.ok(notificationService.save(notification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        if (!notificationService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        notificationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 