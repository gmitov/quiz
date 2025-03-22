import { QuizResults } from '@/app/components/Quiz/QuizResults/QuizResults';
import styles from '../Quiz.module.scss';

export default function ResultsPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Assessment Results</h1>
            <QuizResults />
        </div>
    );
}
