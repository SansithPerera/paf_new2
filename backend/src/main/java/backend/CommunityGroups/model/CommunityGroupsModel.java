package backend.Communications.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;

@Document(collection = "Communications")
public class CommunicationsModel {
    @Id
    @GeneratedValue
    private String id;
    private String adminID;
    private String adminName;
    private String groupTitle;
    private String groupDescription;
    private List<String> groupMembersIDs = new ArrayList<>();

    public CommunicationsModel() {

    }

    