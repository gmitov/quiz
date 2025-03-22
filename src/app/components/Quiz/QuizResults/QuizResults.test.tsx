import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizResults } from './QuizResults';
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

describe('QuizResults', () => {
    // Mock implementations
    const mockResetQuiz = jest.fn();
    const mockPush = jest.fn();
    const mockWindowOpen = jest.fn();

    // Save original window.open
    const originalWindowOpen = window.open;

    beforeEach(() => {
        // Setup mocks before each test
        (useQuiz as jest.Mock).mockReturnValue({
            isRejected: false,
            resetQuiz: mockResetQuiz,
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        // Mock window.open
        window.open = mockWindowOpen;
    });

    afterEach(() => {
        // Reset mocks after each test
        jest.clearAllMocks();
        window.open = originalWindowOpen;
    });

    it('should display success message when not rejected', () => {
        render(<QuizResults />);

        // Check that the success message is displayed
        expect(screen.getByTestId('successMessage')).toBeInTheDocument();
        expect(screen.getByText(/Great news! We have the perfect treatment/)).toBeInTheDocument();

        // Check that the correct buttons are displayed
        expect(screen.getByTestId('continueToManualButton')).toBeInTheDocument();
        expect(screen.getByTestId('goToHomeButton')).toBeInTheDocument();
    });

    it('should display rejection message when rejected', () => {
        // Set isRejected to true
        (useQuiz as jest.Mock).mockReturnValue({
            isRejected: true,
            resetQuiz: mockResetQuiz,
        });

        render(<QuizResults />);

        // Check that the rejection message is displayed
        expect(screen.getByTestId('rejectionMessage')).toBeInTheDocument();
        expect(screen.getByText(/Unfortunately, we are unable to prescribe/)).toBeInTheDocument();

        // Check that the retake button is displayed
        expect(screen.getByTestId('retakeQuizButton')).toBeInTheDocument();
    });

    it('should navigate to quiz page when clicking "Retake Assessment"', () => {
        // Set isRejected to true
        (useQuiz as jest.Mock).mockReturnValue({
            isRejected: true,
            resetQuiz: mockResetQuiz,
        });

        render(<QuizResults />);

        // Click the retake button
        fireEvent.click(screen.getByTestId('retakeQuizButton'));

        // Check that resetQuiz was called
        expect(mockResetQuiz).toHaveBeenCalled();

        // Check that router.push was called with correct path
        expect(mockPush).toHaveBeenCalledWith('/quiz');
    });

    it('should navigate to home page when clicking "Go to home Page"', () => {
        render(<QuizResults />);

        // Click the go to home button
        fireEvent.click(screen.getByTestId('goToHomeButton'));

        // Check that resetQuiz was called
        expect(mockResetQuiz).toHaveBeenCalled();

        // Check that router.push was called with correct path
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should open manual.co in new tab when clicking "Continue to Manual.co"', () => {
        render(<QuizResults />);

        // Click the continue button
        fireEvent.click(screen.getByTestId('continueToManualButton'));

        // Check that window.open was called with correct URL
        expect(mockWindowOpen).toHaveBeenCalledWith('https://www.manual.co', '_blank');
    });
});
