// src/data/quizData.js

export const quizTopics = [
    {
      category: "1. Linux Fundamentals",
      sections: [
        {
          id: 'linux-intro',
          title: 'Linux Basics',
          content: `What is Linux?
  • Open-source operating system
  • Unix-like system architecture
  • Kernel and userspace components
  • Multi-user, multi-tasking design`,
          exercise: {
            prompt: "Explain the key components of Linux and its main features",
            answers: ["kernel", "open source", "multi-user", "unix-like"],
            hint: "Think about core architecture and key characteristics",
            solution: "Key components:\n• Kernel - Core OS component\n• Open Source - Free and modifiable\n• Multi-user - Supports multiple users\n• Unix-like - Based on Unix design"
          }
        }
      ]
    }
  ]