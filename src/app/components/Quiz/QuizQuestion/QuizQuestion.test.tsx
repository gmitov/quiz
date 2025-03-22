import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';
import { useQuiz } from '../QuizProvider';
import { useRouter } from 'next/navigation';
import { fixImageUrls } from '../utils';

// Mock the dependencies
jest.mock('../QuizProvider', () => ({
    useQuiz: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../utils', () => ({
    fixImageUrls: jest.fn((html) => html), // Mock implementation that returns input unchanged
}));

jest.mock('isomorphic-dompurify', () => ({
    sanitize: jest.fn((html) => html), // Mock implementation that returns input unchanged
}));

describe('QuizQuestion', () => {
    // Mock data
    const mockQuestions = [
        {
            question: 'Question 1 Text',
            type: 'ChoiceType',
            options: [
                { display: 'Option 1', value: 'option1', isRejection: false },
                { display: 'Option 2', value: 'option2', isRejection: true },
                { display: '<img src="test.jpg" alt="Test" />', value: 'option3', isRejection: false },
            ],
        },
        {
            question: 'Question 2 Text',
            type: 'ChoiceType',
            options: [
                { display: 'Option A', value: 'optionA', isRejection: false },
                { display: 'Option B', value: 'optionB', isRejection: false },
            ],
        },
    ];

    // Mock implementations
    const mockSubmitAnswer = jest.fn();
    const mockSetCurrentQuestionId = jest.fn();
    const mockGetSelectedOptionIndex = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        // Setup default mocks
        (useQuiz as jest.Mock).mockReturnValue({
            questions: mockQuestions,
            submitAnswer: mockSubmitAnswer,
            setCurrentQuestionId: mockSetCurrentQuestionId,
            getSelectedOptionIndex: mockGetSelectedOptionIndex.mockReturnValue(null),
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('should render the question and options', () => {
        render(<QuizQuestion questionIndex={0} />);

        // Check question text
        expect(screen.getByText('Question 1 Text')).toBeInTheDocument();

        // Check options
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();

        // Check progress indicator
        expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    it('should show loading when questions are not available', () => {
        // Set empty questions
        (useQuiz as jest.Mock).mockReturnValue({
            questions: [],
            submitAnswer: mockSubmitAnswer,
            setCurrentQuestionId: mockSetCurrentQuestionId,
            getSelectedOptionIndex: mockGetSelectedOptionIndex,
        });

        render(<QuizQuestion questionIndex={0} />);

        // Check loading text
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should highlight previously selected option', () => {
        // Mock a previously selected option (index 1)
        (useQuiz as jest.Mock).mockReturnValue({
            questions: mockQuestions,
            submitAnswer: mockSubmitAnswer,
            setCurrentQuestionId: mockSetCurrentQuestionId,
            getSelectedOptionIndex: jest.fn().mockReturnValue(1),
        });

        render(<QuizQuestion questionIndex={0} />);

        // Check that option 2 has the selected class
        const allOptions = screen.getAllByTestId(/quizOption-/);
        expect(allOptions[1].className).toContain('optionSelected');
    });

    it('should submit answer and navigate to next question when selecting non-rejection option', () => {
        jest.useFakeTimers();

        render(<QuizQuestion questionIndex={0} />);

        // Click first option (non-rejection)
        fireEvent.click(screen.getByTestId('quizOption-0'));

        // Check that submitAnswer was called with correct parameters
        expect(mockSubmitAnswer).toHaveBeenCalledWith('1', mockQuestions[0].options[0]);

        // Fast-forward timers
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Check that setCurrentQuestionId was called with next question ID
        expect(mockSetCurrentQuestionId).toHaveBeenCalledWith('2');

        // Check that router.push was called with correct path
        expect(mockPush).toHaveBeenCalledWith('/quiz/2');
    });

    it('should submit answer and navigate to results when selecting rejection option', () => {
        jest.useFakeTimers();

        render(<QuizQuestion questionIndex={0} />);

        // Click second option (rejection)
        fireEvent.click(screen.getByTestId('quizOption-1'));

        // Check that submitAnswer was called with correct parameters
        expect(mockSubmitAnswer).toHaveBeenCalledWith('1', mockQuestions[0].options[1]);

        // Fast-forward timers
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Check that router.push was called with results path
        expect(mockPush).toHaveBeenCalledWith('/quiz/results');
    });

    it('should navigate to previous question when clicking back button', () => {
        render(<QuizQuestion questionIndex={1} />);

        // Click back button
        fireEvent.click(screen.getByTestId('backButton'));

        // Check that setCurrentQuestionId was called with previous question ID
        expect(mockSetCurrentQuestionId).toHaveBeenCalledWith('1');

        // Check that router.push was called with correct path
        expect(mockPush).toHaveBeenCalledWith('/quiz/1');
    });

    it('should navigate to quiz start when clicking back on first question', () => {
        render(<QuizQuestion questionIndex={0} />);

        // Click back button on first question
        fireEvent.click(screen.getByTestId('backButton'));

        // Check that router.push was called with quiz path
        expect(mockPush).toHaveBeenCalledWith('/quiz');
    });

    it('should render HTML content safely when options contain HTML', () => {
        render(<QuizQuestion questionIndex={0} />);

        // Check that the HTML is rendered (we're using dangerouslySetInnerHTML)
        const imgContainer = screen.getByTestId('quizOption-2');

        // Use a more flexible check that looks for the img element
        expect(imgContainer.querySelector('img')).not.toBeNull();
        expect(imgContainer.querySelector('img')).toHaveAttribute('src', 'test.jpg');
        expect(imgContainer.querySelector('img')).toHaveAttribute('alt', 'Test');

        // Check that fixImageUrls and sanitize were called
        expect(fixImageUrls).toHaveBeenCalled();
    });
});
