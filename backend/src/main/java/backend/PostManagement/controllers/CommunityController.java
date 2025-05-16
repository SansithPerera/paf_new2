package backend.Communications.controller;

import backend.Communications.exception.CommunicationsNotFoundException;
import backend.Communications.model.CommunicationsModel;
import backend.Communications.repository.CommunicationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class CommunicationsController {
    @Autowired
    private CommunicationsRepository communicationsRepository;

    @GetMapping("/communications/exists/{groupTitle}")
    public boolean groupTitleExists(@PathVariable String groupTitle) {
        return communicationsRepository.findAll().stream()
                .anyMatch(group -> group.getGroupTitle().equalsIgnoreCase(groupTitle));
    }