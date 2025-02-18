# Linux Learning Module - Setup Guide

## Project Setup

1. **Create a new directory and navigate to it**
```bash
mkdir linux-learning
cd linux-learning
```

2. **Initialize a new Vue project**
```bash
npm create vue@latest
```

Use these answers:
```
✔ Project name: .
✔ Add TypeScript? No
✔ Add JSX Support? No
✔ Add Vue Router? Yes
✔ Add Pinia? No
✔ Add Vitest? No
✔ Add E2E Testing? No
✔ Add ESLint? Yes
✔ Add Prettier? Yes
```

3. **Install dependencies**
```bash
npm install
npm install lucide-vue-next
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Project Structure

Create the following directory structure:
```
linux-learning/
├── node_modules/
├── public/
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── style.css
│   ├── components/
│   │   └── LearningModule.vue
│   ├── views/
│   │   └── HomeView.vue
│   ├── router/
│   │   └── index.js
│   └── data/
│       └── quizData.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## File Contents

### 1. `src/App.vue`
```vue
<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
```

### 2. `src/main.js`
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### 3. `src/style.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 5. `src/router/index.js`
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
```

### 6. `src/views/HomeView.vue`
```vue
<template>
  <main>
    <LearningModule />
  </main>
</template>

<script setup>
import LearningModule from '@/components/LearningModule.vue'
</script>
```

### 7. `src/data/quizData.js`
```javascript
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
      // Add more sections as needed
    ]
  }
]
```

### 8. `src/components/LearningModule.vue`
```vue
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Linux and Container Learning Path</h1>
    
    <div class="mb-8">
      <div class="mb-4 border rounded-lg overflow-hidden">
        <div class="flex items-center p-4 bg-gray-50">
          <Book class="mr-2" :size="20" />
          <h3 class="text-xl font-semibold flex-1">{{ currentTopic.title }}</h3>
        </div>

        <div class="p-4">
          <div class="mb-6 prose max-w-none">
            <pre class="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">{{ currentTopic.content }}</pre>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center mb-4">
              <Terminal class="mr-2" :size="20" />
              <h4 class="text-lg font-semibold">Practice Exercise</h4>
            </div>

            <p class="mb-4">{{ currentTopic.exercise.prompt }}</p>

            <div class="mb-4">
              <textarea
                v-model="currentAnswer"
                class="w-full p-3 border rounded-md font-mono"
                rows="3"
                placeholder="Enter your answer..."
              />
            </div>

            <div class="flex gap-4">
              <button
                @click="checkCurrentAnswer"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Check Answer
              </button>
              <button
                @click="toggleHint"
                class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                {{ showHint ? 'Hide Hint' : 'Show Hint' }}
              </button>
              <button
                @click="toggleSolution"
                class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                {{ showSolution ? 'Hide Solution' : 'Show Solution' }}
              </button>
            </div>

            <div v-if="showHint" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div class="flex items-center gap-2">
                <Info class="text-yellow-500" :size="20" />
                <p class="font-semibold">Hint:</p>
              </div>
              <p class="mt-1">{{ currentTopic.exercise.hint }}</p>
            </div>

            <div v-if="currentFeedback" class="mt-4 p-3 bg-gray-100 rounded-md">
              <div class="flex items-center gap-2 mb-2">
                <component 
                  :is="currentFeedback.correct ? 'CheckCircle' : 'Info'"
                  :class="currentFeedback.correct ? 'text-green-500' : 'text-yellow-500'"
                  :size="20" 
                />
                <p class="font-semibold">{{ currentFeedback.feedback }}</p>
              </div>
              <p v-if="currentFeedback.details" class="text-gray-600 mt-1">
                {{ currentFeedback.details }}
              </p>
              <div v-if="currentFeedback.score" class="mt-2 h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-full bg-green-500 rounded-full"
                  :style="{ width: currentFeedback.score + '%' }"
                />
              </div>
            </div>

            <div v-if="showSolution" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 class="font-semibold mb-2">Solution:</h4>
              <pre class="whitespace-pre-wrap">{{ currentTopic.exercise.solution }}</pre>
            </div>

            <div v-if="currentFeedback?.correct" class="mt-4 flex justify-end">
              <button
                @click="nextTopic"
                class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
              >
                Next Topic
                <ChevronRight :size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 p-4 bg-blue-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Learning Progress</h3>
      <p>Topics completed: {{ completedTopics.length }} / {{ totalTopics }}</p>
      <div class="mt-2 h-2 bg-gray-200 rounded-full">
        <div 
          class="h-full bg-blue-500 rounded-full"
          :style="{ width: (completedTopics.length / totalTopics) * 100 + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Book, Terminal, CheckCircle, AlertCircle, ChevronRight, ChevronDown, Info } from 'lucide-vue-next'
import { quizTopics } from '@/data/quizData'

// State
const currentTopicIndex = ref(0)
const currentAnswer = ref('')
const completedTopics = ref([])
const showHint = ref(false)
const showSolution = ref(false)
const currentFeedback = ref(null)

// Computed
const allTopics = computed(() => {
  return quizTopics.reduce((acc, category) => {
    return [...acc, ...category.sections]
  }, [])
})

const totalTopics = computed(() => allTopics.value.length)
const currentTopic = computed(() => allTopics.value[currentTopicIndex.value])

// Methods
const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null)
    .map(() => Array(str1.length + 1).fill(null))

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  return matrix[str2.length][str1.length]
}

const checkAnswer = (userInput, correctAnswers) => {
  const userWords = userInput
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)

  const answers = Array.isArray(correctAnswers) 
    ? correctAnswers 
    : correctAnswers.toLowerCase().split(/\s+/)

  const matches = answers.map(answer => {
    const found = userWords.some(word => {
      if (word === answer.toLowerCase()) return true
      if (word.length > 4 && (word.includes(answer) || answer.includes(word))) return true
      return word.length > 4 && levenshteinDistance(word, answer) <= 2
    })
    return { answer, found }
  })

  const score = (matches.filter(m => m.found).length / answers.length) * 100
  const missing = matches.filter(m => !m.found).map(m => m.answer)

  if (score >= 80) {
    return {
      correct: true,
      score,
      feedback: "Excellent! You've mastered this concept.",
      details: missing.length ? `Optional additions: ${missing.join(', ')}` : "Complete understanding!"
    }
  } else if (score >= 60) {
    return {
      correct: true,
      score,
      feedback: "Good work! You understand the main concepts.",
      details: `Consider adding: ${missing.join(', ')}`
    }
  } else if (score >= 40) {
    return {
      correct: false,
      score,
      feedback: "You're on the right track but missing some key points.",
      details: `Key concepts to include: ${missing.join(', ')}`
    }
  } else {
    return {
      correct: false,
      score,
      feedback: "Review the material and try again.",
      details: `Focus on these concepts: ${answers.join(', ')}`
    }
  }
}

const checkCurrentAnswer = () => {
  const result = checkAnswer(currentAnswer.value, currentTopic.value.exercise.answers)
  currentFeedback.value = result
  if (result.correct && !completedTopics.value.includes(currentTopic.value.id)) {
    completedTopics.value.push(currentTopic.value.id)
  }
}

const nextTopic = () => {
  if (currentTopicIndex.value < allTopics.value.length - 1) {
    currentTopicIndex.value++
    currentAnswer.value = ''
    currentFeedback.value = null
    showHint.value = false
    showSolution.value = false
  }
}

const toggleHint = () => {
  showHint.value = !showHint.value
}

const toggleSolution = () => {
  showSolution.value = !showSolution.value
}
</script>
```

## Running the Project

1. **Create all the files with their respective content**

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Access the application**
- Open http://localhost:5173 in your browser
- You should see the Linux Learning Module interface

## Troubleshooting

If you encounter any errors:
1. Check the browser console for error messages
2. Verify all files have the correct content
3. Make sure all dependencies are installed correctly
4. Verify file paths and imports are correct
5. Try clearing the node_modules and reinstalling:
```bash
rm -rf node_modules
npm install
```