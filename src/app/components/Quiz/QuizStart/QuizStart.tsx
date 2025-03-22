'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '../QuizProvider';
import styles from './QuizStart.module.scss';

const QuizStart = () => {
    const router = useRouter();
    const { isLoading, error, setCurrentQuestionId } = useQuiz();

    const handleStartQuiz = () => {
        // Start with the first question
        setCurrentQuestionId('1');
        router.push('/quiz/1');
    };

    if (isLoading) {
        return (
            <div className={styles.quizStartContainer}>
                <p className={styles.loadingText}>Loading quiz questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.quizStartContainer}>
                <div className={styles.errorContainer}>
                    <h2 className={styles.errorTitle}>Error Loading Quiz</h2>
                    <p className={styles.description}>{error}</p>
                </div>
                <button onClick={() => window.location.reload()} className={styles.tryAgainButton}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.quizStartContainer}>
            <h2 className={styles.title}>Hair Loss Assessment</h2>
            <p className={styles.description}>
                Answer a few questions to help us understand your hair loss and find the right treatment for you.
            </p>

            <button data-testid={'startAssessmentButton'} onClick={handleStartQuiz} className={styles.startButton}>
                Start Assessment
            </button>
        </div>
    );
};

export default QuizStart;
