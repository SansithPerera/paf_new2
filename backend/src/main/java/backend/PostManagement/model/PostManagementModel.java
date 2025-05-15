package backend.PostManagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

@Document(collection = "posts")
public class PostManagementModel {
    @Id
    private String id;
    private String userID;
    private String title;
    private String description;
    private List<String> media;
    private Map<String, Boolean> likes = new HashMap<>(); // Map to store user likes
    private List<Comment> comments = new ArrayList<>(); // List to store comments
    private String category; // New field for category

    public PostManagementModel(String id, String userID, String title, String description, List<String> media) {
        this.id = id;
        this.userID = userID;
        this.title = title;
        this.description = description;
        this.media = media;
    }