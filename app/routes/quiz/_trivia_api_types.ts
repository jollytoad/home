export interface TextChoiceQuestion {
  type: "text_choice";
  id: string;
  question: {
    text: string;
  };
  correctAnswer: string;
  incorrectAnswers: string[];
  category: string;
  tags: string[];
  difficulty: string;
  regions: string[];
  isNiche: boolean;
}
