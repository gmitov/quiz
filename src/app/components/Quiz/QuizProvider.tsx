'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type QuizOption = {
    display: string;
    value: string | boolean;
    isRejection: boolean;
};

type StoredAnswer = QuizOption;

type Question = {
    question: string;
    type: string;
    options: QuizOption[];
};

type QuizContextType = {
    questions: Question[];
    currentQuestionId: string | null;
    userAnswers: Record<string, StoredAnswer>;
    isLoading: boolean;
    error: string | null;
    isRejected: boolean;
    submitAnswer: (questionId: string, answer: QuizOption) => void;
    setCurrentQuestionId: (id: string | null) => void;
    resetQuiz: () => void;
    getSelectedOptionIndex: (questionId: string) => number | null;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Session storage keys
const ANSWERS_STORAGE_KEY = 'quiz_answers';
const CURRENT_QUESTION_KEY = 'quiz_current_question';
const REJECTION_STATE_KEY = 'quiz_rejection_state';

export const QuizProvider = ({ children }: { children: ReactNode }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, StoredAnswer>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRejected, setIsRejected] = useState(false);

    // Load saved data from session storage on initialization
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Load saved answers
                const savedAnswers = sessionStorage.getItem(ANSWERS_STORAGE_KEY);
                if (savedAnswers) {
                    setUserAnswers(JSON.parse(savedAnswers));
                }

                // Load current question
                const savedCurrentQuestion = sessionStorage.getItem(CURRENT_QUESTION_KEY);
                if (savedCurrentQuestion) {
                    setCurrentQuestionId(savedCurrentQuestion);
                }

                // Load rejection state
                const savedRejectionState = sessionStorage.getItem(REJECTION_STATE_KEY);
                if (savedRejectionState) {
                    setIsRejected(JSON.parse(savedRejectionState));
                }
            } catch (e) {
                console.error('Error loading quiz state from session storage:', e);
            }
        }
    }, []);

    // Fetch quiz data
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/quiz');

                if (!response.ok) {
                    throw new Error('Failed to fetch quiz data');
                }

                const data = await response.json();
                setQuestions(data.questions);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error('Error fetching quiz data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, []);

    // Update session storage when answers change
    useEffect(() => {
        if (typeof window !== 'undefined' && Object.keys(userAnswers).length > 0) {
            sessionStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(userAnswers));
        }
    }, [userAnswers]);

    // Update session storage when current question changes
    useEffect(() => {
        if (typeof window !== 'undefined' && currentQuestionId) {
            sessionStorage.setItem(CURRENT_QUESTION_KEY, currentQuestionId);
        }
    }, [currentQuestionId]);

    // Update session storage when rejection state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(REJECTION_STATE_KEY, JSON.stringify(isRejected));
        }
    }, [isRejected]);

    const submitAnswer = (questionId: string, answer: QuizOption) => {
        // Store the user's answer
        setUserAnswers((prev) => {
            const newAnswers = {
                ...prev,
                [questionId]: answer,
            };

            return newAnswers;
        });

        // Check if this answer causes rejection
        if (answer.isRejection) {
            setIsRejected(true);
        }
    };

    const resetQuiz = () => {
        // Clear state
        setCurrentQuestionId(null);
        setUserAnswers({});
        setIsRejected(false);

        // Clear session storage
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
            sessionStorage.removeItem(CURRENT_QUESTION_KEY);
            sessionStorage.removeItem(REJECTION_STATE_KEY);
        }
    };

    // Helper function to get the selected option index for a question
    const getSelectedOptionIndex = (questionId: string): number | null => {
        const answer = userAnswers[questionId];
        if (!answer || !questions.length) return null;

        const questionIndex = parseInt(questionId) - 1;
        if (questionIndex < 0 || questionIndex >= questions.length) return null;

        const question = questions[questionIndex];

        // Find the option index that matches the saved answer
        return question.options.findIndex(
            (option) => option.value === answer.value && option.isRejection === answer.isRejection
        );
    };

    return (
        <QuizContext.Provider
            value={{
                questions,
                currentQuestionId,
                userAnswers,
                isLoading,
                error,
                isRejected,
                submitAnswer,
                setCurrentQuestionId,
                resetQuiz,
                getSelectedOptionIndex,
            }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};
