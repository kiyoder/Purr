package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.NewsFeedEntity;
import com.g1appdev.Hubbits.repository.NewsFeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class NewsFeedService {

    @Autowired
    private NewsFeedRepository newsFeedRepository;

    private static final String UPLOAD_DIR = "src\\main\\resources\\images"; 

    // Retrieve all news feed articles
    public List<NewsFeedEntity> getAllArticles() {
        return newsFeedRepository.findAll();
    }

    // Retrieve a news feed article by ID
    public Optional<NewsFeedEntity> getArticleById(Long articleID) {
        return newsFeedRepository.findById(articleID);
    }

    // Create a new news feed article with optional image handling
    public NewsFeedEntity createArticle(NewsFeedEntity newsFeed, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            try {
                byte[] imageBytes = image.getBytes();
                newsFeed.setImage(imageBytes); // Set the image bytes in the NewsFeedEntity
            } catch (IOException e) {
                e.printStackTrace();
                // Handle image saving error
                throw new RuntimeException("Failed to process image.");
            }
        }
        return newsFeedRepository.save(newsFeed); // Save article with or without image
    }

    // Update an existing news feed article by ID with image
    public NewsFeedEntity updateArticleWithImage(Long articleID, NewsFeedEntity updatedNewsFeed, byte[] image) {
        Optional<NewsFeedEntity> newsFeedOpt = newsFeedRepository.findById(articleID);
        if (newsFeedOpt.isPresent()) {
            NewsFeedEntity newsFeed = newsFeedOpt.get();
            newsFeed.setTitle(updatedNewsFeed.getTitle());
            newsFeed.setContent(updatedNewsFeed.getContent());
            newsFeed.setPublishedDate(updatedNewsFeed.getPublishedDate());
            newsFeed.setAuthor(updatedNewsFeed.getAuthor());
            newsFeed.setImage(image); // Set the new image
            return newsFeedRepository.save(newsFeed);
        }
        return null; // If no article is found by the ID
    }

    // Get image by article ID
    public byte[] getImageByArticleId(Long articleID) {
        Optional<NewsFeedEntity> newsFeed = newsFeedRepository.findById(articleID);
        return newsFeed.map(NewsFeedEntity::getImage).orElse(null); // Return image bytes or null
    }

    // Delete a news feed article by ID
    public boolean deleteArticle(Long articleID) {
        if (newsFeedRepository.existsById(articleID)) {
            newsFeedRepository.deleteById(articleID);
            return true; // Successfully deleted
        }
        return false; // Article not found
    }
}
