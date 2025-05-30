interface QuestionCardProps {
  question: {
    id: string;
    statement: string;
    subject: string;
    year: number;
    organization: string;
    options: {
      id: string;
      text: string;
    }[];
  };
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="question-card mb-6">
      {/* Question Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-2">
          <span className="tag">{question.subject}</span>
          <span className="tag">{question.organization}</span>
          <span className="tag">{question.year}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="text-accent hover:text-accent/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
          <button className="text-accent hover:text-accent/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Question Statement */}
      <div className="mb-6 text-foreground">
        <p className="text-lg">{question.statement}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-neutral/20 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              className="mt-1"
            />
            <span>{option.text}</span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button className="btn-primary">Confirmar resposta</button>
        <div className="flex items-center gap-4">
          <button className="text-accent hover:text-accent/80">Pular</button>
          <button className="text-accent hover:text-accent/80">
            Comentários
          </button>
        </div>
      </div>
    </div>
  );
}
