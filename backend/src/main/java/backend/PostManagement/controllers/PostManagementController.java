package backend.PostManagement.controller;

import backend.exception.ResourceNotFoundException;
import backend.PostManagement.model.Comment;
import backend.Notification.model.NotificationModel;
import backend.PostManagement.model.PostManagementModel;
import backend.Notification.repository.NotificationRepository;
import backend.PostManagement.repository.PostManagementRepository;
import backend.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
public class PostManagementController {
    @Autowired
    private PostManagementRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Value("${media.upload.dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam String userID,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category, // New parameter for category
            @RequestParam List<MultipartFile> mediaFiles) {

        if (mediaFiles.size() < 1 || mediaFiles.size() > 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You must upload between 1 and 3 media files.");
        }