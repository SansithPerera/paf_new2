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
  
    // Insert
    @PostMapping("/communications")
    public CommunicationsModel newCommunicationsModel(@RequestBody CommunicationsModel newCommunicationsModel) {
        if (groupTitleExists(newCommunicationsModel.getGroupTitle())) {
            throw new IllegalArgumentException("Group title already exists.");
        }
        return communicationsRepository.save(newCommunicationsModel);
    }  
    
    @GetMapping("/communications")
    List<CommunicationsModel> getAll() {
        return communicationsRepository.findAll();
    }

    @GetMapping("/communications/{id}")
    CommunicationsModel getById(@PathVariable String id) {
        return communicationsRepository.findById(id)
                .orElseThrow(() -> new CommunicationsNotFoundException(id));
    }

    @PutMapping("/communications/{id}")
    public CommunicationsModel update(@RequestBody CommunicationsModel newCommunicationsModel, @PathVariable String id) {
        if (groupTitleExists(newCommunicationsModel.getGroupTitle())) {
            throw new IllegalArgumentException("Group title already exists.");
        }
        return communicationsRepository.findById(id)
                .map(communicationsModel -> {
                    // Update fields
                    communicationsModel.setAdminID(newCommunicationsModel.getAdminID());
                    communicationsModel.setAdminName(newCommunicationsModel.getAdminName());
                    communicationsModel.setGroupTitle(newCommunicationsModel.getGroupTitle());
                    communicationsModel.setGroupDescription(newCommunicationsModel.getGroupDescription());
                    return communicationsRepository.save(communicationsModel);
                }).orElseThrow(() -> new CommunicationsNotFoundException(id));
    } 