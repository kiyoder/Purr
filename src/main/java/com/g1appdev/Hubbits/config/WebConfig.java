package com.g1appdev.Hubbits.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        // Allow cross-origin requests from the specified frontend address
        registry.addMapping("/**")  // Apply this configuration to all endpoints
                .allowedOrigins("http://localhost:5173")  // Allow the React frontend running on localhost:5173
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allow the specified HTTP methods
                .allowedHeaders("*")  // Allow any headers
                .allowedHeaders("Content-Type", "Authorization", "Origin", "Accept", "X-Requested-With", "Cache-Control", "X-File-Name")  // Include headers that may be needed for file uploads
                .allowCredentials(true);  // Allow credentials (cookies, authorization headers)
    }

    @Override
    public void addResourceHandlers(@SuppressWarnings("null") ResourceHandlerRegistry registry) {
        // Serve static images from the /images folder in the resources directory
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/images/");
    }
}
