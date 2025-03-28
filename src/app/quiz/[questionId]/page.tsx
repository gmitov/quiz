'use client';

import QuizQuestion from '@/app/components/Quiz/QuizQuestion/QuizQuestion';
import { notFound } from 'next/navigation';
import styles from '../Quiz.module.scss';
import { use } from 'react';

type ParamsPromise = Promise<{ questionId: string }>;

export default function QuestionPage({ params }: { params: { questionId: string } }) {
    // Unwrap the params promise using React.use()
    const unwrappedParams = use(params as unknown as ParamsPromise);

    const questionId = unwrappedParams.questionId;
    const questionIndex = parseInt(questionId) - 1;

    // Check if question ID is valid
    if (isNaN(questionIndex) || questionIndex < 0) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Hair Loss Assessment</h1>
            <QuizQuestion questionIndex={questionIndex} />
        </div>
    );
}
