"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Option = {
  text: string;
  animal: string;
};

type Question = {
  text: string;
  options: Option[];
};

const questions: Question[] = [
  {
    text: "What is your favorite type of food?",
    options: [
      { text: "Meat", animal: "dog" },
      { text: "Fish", animal: "cat" },
      { text: "Plants", animal: "hamster" },
      { text: "Anything", animal: "horse" },
      { text: "Berries", animal: "fox" },
    ],
  },
  {
    text: "How do you prefer to spend your free time?",
    options: [
      { text: "Running around", animal: "fox" },
      { text: "Sleeping", animal: "cat" },
      { text: "Playing fetch", animal: "dog" },
      { text: "Exploring", animal: "horse" },
      { text: "Nibbling", animal: "hamster" },
    ],
  },
  {
    text: "What is your personality like?",
    options: [
      { text: "Loyal", animal: "dog" },
      { text: "Independent", animal: "cat" },
      { text: "Curious", animal: "fox" },
      { text: "Energetic", animal: "horse" },
      { text: "Quiet", animal: "hamster" },
    ],
  },
  {
    text: "Which environment do you thrive in?",
    options: [
      { text: "Open fields", animal: "horse" },
      { text: "Urban streets", animal: "fox" },
      { text: "Homes", animal: "cat" },
      { text: "Backyards", animal: "dog" },
      { text: "Small cages", animal: "hamster" },
    ],
  },
  {
    text: "What is your favorite activity?",
    options: [
      { text: "Chasing balls", animal: "dog" },
      { text: "Climbing trees", animal: "cat" },
      { text: "Hunting", animal: "fox" },
      { text: "Running fast", animal: "horse" },
      { text: "Nibbling seeds", animal: "hamster" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const qs = questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(qs);
  }, []);

  const handleAnswer = (animal: string) => {
    setAnswers((prev) => [...prev, animal]);
    setCurrent((prev) => prev + 1);
  };

  const getResult = () => {
    const counts: Record<string, number> = {};
    answers.forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts));
    const winners = Object.entries(counts)
      .filter(([, v]) => v === max)
      .map(([k]) => k);
    return winners[0];
  };

  if (shuffledQuestions.length === 0) {
    return null;
  }

  if (current >= shuffledQuestions.length) {
    const result = getResult();
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">You are a {result}!</h2>
        <img
          src={`/${result}.png`}
          alt={result}
          width={256}
          height={256}
          className="rounded"
        />
        <Share
          text={`I am a ${result}! Take the quiz: ${url}`}
        />
        <Button onClick={() => {
          setCurrent(0);
          setAnswers([]);
        }}>
          Retake Quiz
        </Button>
      </div>
    );
  }

  const q = shuffledQuestions[current];
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl">{q.text}</h3>
      <div className="flex flex-col gap-2">
        {q.options.map((opt) => (
          <Button
            key={opt.text}
            onClick={() => handleAnswer(opt.animal)}
          >
            {opt.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
