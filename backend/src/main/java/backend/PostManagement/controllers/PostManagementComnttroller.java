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