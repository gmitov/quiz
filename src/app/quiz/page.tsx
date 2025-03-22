import { QuizStart } from '../components/Quiz/QuizStart/QuizStart';
import styles from './Quiz.module.scss';

export default function QuizPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Hair Loss Assessment</h1>
            <QuizStart />
        </div>
    );
}
