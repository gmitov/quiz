import { QuizProvider } from '../components/Quiz/QuizProvider';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
    return <QuizProvider>{children}</QuizProvider>;
}
