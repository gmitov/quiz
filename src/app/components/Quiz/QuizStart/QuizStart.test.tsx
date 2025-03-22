import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizStart } from './QuizStart';
import { useQuiz } from '../QuizProvider';
import { useRouter } from 'next/navigation';

// Mock the QuizProvider hook
jest.mock('../QuizProvider', () => ({
    useQuiz: jest.fn(),
}));

// Mock the next/navigation router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('QuizStart', () => {
    const mockSetCurrentQuestionId = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        // Setup default mocks
        (useQuiz as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            setCurrentQuestionId: mockSetCurrentQuestionId,
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the quiz start screen', () => {
        render(<QuizStart />);

        // Check that the title and description are displayed
        expect(screen.getByText('Hair Loss Assessment')).toBeInTheDocument();
        expect(screen.getByText(/Answer a few questions to help us understand/)).toBeInTheDocument();

        // Check that the start button is displayed
        expect(screen.getByTestId('startAssessmentButton')).toBeInTheDocument();
        expect(screen.getByText('Start Assessment')).toBeInTheDocument();
    });

    it('should show loading state when isLoading is true', () => {
        // Set isLoading to true
        (useQuiz as jest.Mock).mockReturnValue({
            isLoading: true,
            error: null,
            setCurrentQuestionId: mockSetCurrentQuestionId,
        });

        render(<QuizStart />);

        // Check that the loading text is displayed
        expect(screen.getByText('Loading quiz questions...')).toBeInTheDocument();

        // Check that the start button is not displayed
        expect(screen.queryByText('Start Assessment')).not.toBeInTheDocument();
    });

    it('should show error state when there is an error', () => {
        // Set error
        const errorMessage = 'Failed to fetch quiz data';
        (useQuiz as jest.Mock).mockReturnValue({
            isLoading: false,
            error: errorMessage,
            setCurrentQuestionId: mockSetCurrentQuestionId,
        });

        render(<QuizStart />);

        // Check that the error message is displayed
        expect(screen.getByText('Error Loading Quiz')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();

        // Check that the try again button is displayed
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should navigate to first question when clicking "Start Assessment"', () => {
        render(<QuizStart />);

        // Click the start button
        fireEvent.click(screen.getByTestId('startAssessmentButton'));

        // Check that setCurrentQuestionId was called with correct ID
        expect(mockSetCurrentQuestionId).toHaveBeenCalledWith('1');

        // Check that router.push was called with correct path
        expect(mockPush).toHaveBeenCalledWith('/quiz/1');
    });

    it('should reload the page when clicking "Try Again" in error state', () => {
        // Save original window.location
        const originalLocation = window.location;

        // Mock location.reload
        const mockReload = jest.fn();

        // Delete and recreate window.location with the mocked reload
        delete window.location;
        window.location = { ...originalLocation, reload: mockReload } as Location;

        // Set error
        (useQuiz as jest.Mock).mockReturnValue({
            isLoading: false,
            error: 'Error message',
            setCurrentQuestionId: mockSetCurrentQuestionId,
        });

        render(<QuizStart />);

        // Click the try again button
        fireEvent.click(screen.getByText('Try Again'));

        // Check that location.reload was called
        expect(mockReload).toHaveBeenCalled();

        // Restore original location
        window.location = originalLocation;
    });
});
