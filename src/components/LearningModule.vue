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