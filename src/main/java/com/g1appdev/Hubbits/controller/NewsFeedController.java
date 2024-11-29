package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.NewsFeedEntity;
import com.g1appdev.Hubbits.service.NewsFeedService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/newsfeed")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your frontend URL
public class NewsFeedController {

    @Autowired
    private NewsFeedService newsFeedService;

    // Get all articles
    @GetMapping
    public List<NewsFeedEntity> getAllArticles() {
        return newsFeedService.getAllArticles();
    }

    // Get article by ID
    @GetMapping("/{id}")
    public ResponseEntity<NewsFeedEntity> getArticleById(@PathVariable Long id) {
        Optional<NewsFeedEntity> article = newsFeedService.getArticleById(id);
        return article.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createArticle(
        @Valid @RequestPart("article") @RequestBody NewsFeedEntity article,
        @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            // Validate and process the article
            NewsFeedEntity createdArticle = newsFeedService.createArticle(article, image);

            // Validate image type if present
            if (image != null && !image.isEmpty()) {
                String contentType = image.getContentType();
                if (contentType != null && (contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                    // Process the image (e.g., save it)
                    // newsFeedService.saveImage(image);
                } else {
                    return ResponseEntity.badRequest().body("Only JPEG and PNG images are allowed.");
                }
            }

            return ResponseEntity.ok(createdArticle);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("An error occurred while creating the article.");
        }
    }


    // Update article by ID with image
    @PutMapping("/{id}/image")
    public ResponseEntity<NewsFeedEntity> updateArticleWithImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image,
            @RequestBody NewsFeedEntity article) {
        try {
            byte[] imageBytes = image.getBytes(); // Convert MultipartFile to byte array
            NewsFeedEntity updatedArticle = newsFeedService.updateArticleWithImage(id, article, imageBytes);
            if (updatedArticle != null) {
                return ResponseEntity.ok(updatedArticle);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Get article image
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getArticleImage(@PathVariable Long id) {
        byte[] image = newsFeedService.getImageByArticleId(id);
        if (image != null) {
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg") // Assuming JPEG, adjust as needed
                    .body(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete article by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        boolean deleted = newsFeedService.deleteArticle(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
