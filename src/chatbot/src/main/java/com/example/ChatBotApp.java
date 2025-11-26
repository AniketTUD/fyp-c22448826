package com.example;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.service.*;
import java.util.Scanner;

public class ChatBotApp {
    public static void main(String[] args) {
        Assistant assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(
                    OpenAiChatModel.builder()
                        .apiKey(System.getenv("OPENAI_API_KEY"))
                        .modelName("gpt-4o-mini")
                        .build()
                )
                .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
                .build();

        Scanner scanner = new Scanner(System.in);

        System.out.println("Chatbot started! Type 'exit' to quit.");

        while (true) {
            System.out.print("You: ");
            String input = scanner.nextLine();
            if (input.equalsIgnoreCase("exit")) break;

            String reply = assistant.chat(input);
            System.out.println("Bot: " + reply);
        }
    }
}
