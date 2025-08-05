export interface Option {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  timeLimit: number
  options: Option[]
}

export interface QuizData {
  title: string
  description: string
  category: string
  questions: Question[]
}

