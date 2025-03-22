'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '../QuizProvider';
import DOMPurify from 'isomorphic-dompurify';
import { fixImageUrls } from '../utils';
import styles from './QuizQuestion.module.scss';

type QuizQuestionProps = {
    questionIndex: number;
};

const QuizQuestion = ({ questionIndex }: QuizQuestionProps) => {
    const router = useRouter();
    const { questions, submitAnswer, setCurrentQuestionId, getSelectedOptionIndex } = useQuiz();

    // If we don't have questions yet or the index is out of bounds, show loading
    if (!questions.length || questionIndex >= questions.length) {
        return <div className={styles.loadingContainer}>Loading...</div>;
    }

    const question = questions[questionIndex];
    const isLastQuestion = questionIndex === questions.length - 1;
    const isFirstQuestion = questionIndex === 0;
    const questionId = (questionIndex + 1).toString();

    // Get the previously selected answer for this question (if any)
    const selectedOptionIndex = getSelectedOptionIndex(questionId);

    const handleOptionSelect = (optionIndex: number) => {
        const selectedOption = question.options[optionIndex];

        // Submit the answer
        submitAnswer(questionId, selectedOption);

        // Short delay to show the selection before navigating
        setTimeout(() => {
            // If selected option causes rejection or it's the last question, go to results
            if (selectedOption.isRejection || isLastQuestion) {
                router.push('/quiz/results');
            } else {
                // Otherwise go to the next question
                const nextQuestionId = (questionIndex + 2).toString();
                setCurrentQuestionId(nextQuestionId);
                router.push(`/quiz/${nextQuestionId}`);
            }
        }, 300); // 300ms delay for visual feedback
    };

    const handleBackClick = () => {
        if (!isFirstQuestion) {
            const prevQuestionId = questionIndex.toString();
            setCurrentQuestionId(prevQuestionId);
            router.push(`/quiz/${prevQuestionId}`);
        } else {
            // If it's the first question, go back to the quiz landing page
            router.push('/quiz');
        }
    };

    // Helper function to safely render HTML from the API
    const createMarkup = (html: string) => {
        // Fix any issues with image URLs
        const fixedHtml = fixImageUrls(html);
        return { __html: DOMPurify.sanitize(fixedHtml) };
    };

    return (
        <div className={styles.questionContainer}>
            <div className={styles.progressContainer}>
                <button data-testid="backButton" onClick={handleBackClick} className={styles.backButton}>
                    ← Back
                </button>
                <div className={styles.progressText}>
                    Question {questionIndex + 1} of {questions.length}
                </div>
            </div>

            <h2 className={styles.questionText}>{question.question}</h2>

            <div className={styles.optionsContainer}>
                {question.options.map((option, index) => (
                    <div
                        key={index}
                        data-testid={`quizOption-${index}`}
                        onClick={() => handleOptionSelect(index)}
                        className={`
              ${styles.optionItem} 
              ${selectedOptionIndex === index ? styles.optionSelected : ''}
            `}>
                        {option.display.includes('<img') ? (
                            <div
                                className={styles.imageOption}
                                dangerouslySetInnerHTML={createMarkup(option.display)}
                            />
                        ) : (
                            <div>{option.display}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizQuestion;
