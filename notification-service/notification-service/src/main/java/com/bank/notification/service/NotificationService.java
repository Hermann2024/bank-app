package com.bank.notification.service;

import com.bank.notification.entity.Notification;
import com.bank.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> findByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteById(Long id) {
        notificationRepository.deleteById(id);
    }
} 