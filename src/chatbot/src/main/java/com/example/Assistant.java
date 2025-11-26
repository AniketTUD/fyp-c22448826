package com.example;

import dev.langchain4j.service.*;

public interface Assistant {
    @SystemMessage("You are a helpful and friendly chatbot.")
    String chat(String userMessage);
}

