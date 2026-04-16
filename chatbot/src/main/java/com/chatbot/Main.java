package com.chatbot;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.ollama.OllamaChatModel;


public class Main {

    public static void main(String[] args) {

        ChatModel model = OllamaChatModel.builder()
                .baseUrl("http://localhost:11434")
                .modelName("llama3")
                .temperature(0.7)
                .timeout(java.time.Duration.ofSeconds(60))
                .build();

        String userMessage = "What colour is the sky?";

        String response = model.chat(userMessage);

        System.out.println("Prompt:");
        System.out.println(userMessage);
        System.out.println();
        System.out.println("Response:");
        System.out.println(response);
    }
}