'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '../QuizProvider';
import styles from './QuizResults.module.scss';

const QuizResults = () => {
    const router = useRouter();
    const { isRejected, resetQuiz } = useQuiz();

    const handleRetakeQuiz = () => {
        resetQuiz();
        router.push('/quiz');
    };

    const handleHomePage = () => {
        resetQuiz();
        router.push('/');
    };

    const handleContinue = () => {
        window.open('https://www.manual.co', '_blank');
    };

    return (
        <div className={styles.resultsContainer}>
            <h2 className={styles.title}>{isRejected ? 'Assessment Results' : 'Great News!'}</h2>

            {isRejected ? (
                <div>
                    <div
                        data-testid="rejectionMessage"
                        className={`${styles.messageContainer} ${styles.rejectionMessage}`}>
                        <p className={styles.messageText}>
                            Unfortunately, we are unable to prescribe this medication for you. This is because
                            finasteride can alter the PSA levels, which may be used to monitor for cancer. You should
                            discuss this further with your GP or specialist if you would still like this medication.
                        </p>
                    </div>

                    <button data-testid="retakeQuizButton" onClick={handleRetakeQuiz} className={styles.primaryButton}>
                        Retake Assessment
                    </button>
                </div>
            ) : (
                <div>
                    <div data-testid="successMessage" className={`${styles.messageContainer} ${styles.successMessage}`}>
                        <p className={styles.messageText}>
                            Great news! We have the perfect treatment for your hair loss. Proceed to www.manual.co, and
                            prepare to say hello to your new hair!
                        </p>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button
                            data-testid="continueToManualButton"
                            onClick={handleContinue}
                            className={styles.primaryButton}>
                            Continue to Manual.co
                        </button>

                        <button
                            data-testid="goToHomeButton"
                            onClick={handleHomePage}
                            className={styles.secondaryButton}>
                            Go to home Page
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizResults;
