package backend.User.controller;

import backend.exception.ResourceNotFoundException;
import backend.Notification.model.NotificationModel;
import backend.User.model.UserModel;
import backend.LearningPlan.model.LearningPlanModel; // Import LearningPlanModel
import backend.Notification.repository.NotificationRepository;
import backend.User.repository.UserRepository;
import backend.Achievements.repository.AchievementsRepository; // Import the repository
import backend.LearningPlan.repository.LearningPlanRepository; // Import the repository
import backend.PostManagement.repository.PostManagementRepository; // Import the repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;