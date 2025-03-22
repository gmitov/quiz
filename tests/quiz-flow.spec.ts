import { test, expect, Page } from '@playwright/test';

test.describe('Hair Loss Quiz Flow', () => {
    // Longer timeout for all navigation events, especially for WebKit and Mobile Safari
    const navigationTimeout = 5000;

    test.beforeEach(async ({ page }) => {
        // Go to the home page before each test
        await page.goto('/');
    });

    // Helper function to safely navigate after selecting an option
    async function selectOptionAndWaitForNavigation(
        page: Page,
        optionSelector: string,
        expectedUrl: string
    ): Promise<void> {
        // Click the option
        await page.locator(optionSelector).click();

        // Wait for navigation with increased timeout
        await expect(page).toHaveURL(expectedUrl, { timeout: navigationTimeout });

        // Add a small delay to ensure page is fully loaded
        await page.waitForTimeout(500);
    }

    test('should navigate through the entire quiz with successful outcome', async ({ page }) => {
        // Start the quiz from the home page by clicking the button
        await page.locator('[data-testid="buttonCallToAction"]').click();

        // Verify we're on the quiz start page
        await expect(page).toHaveURL('/quiz');

        // Start the assessment
        await page.locator('[data-testid="startAssessmentButton"]').click();

        // Verify we're on the first question
        await expect(page).toHaveURL('/quiz/1');

        // Answer the first question (select the non-rejection option "Temples" - first option)
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-0"]', '/quiz/2');

        // Answer the second question with "No" to avoid rejection (second option)
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/3');

        // Answer the third question with "No" to avoid rejection (second option)
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/results');

        // Verify success message is visible
        await expect(page.locator('[data-testid="successMessage"]')).toContainText(
            'Great news! We have the perfect treatment for your hair loss'
        );

        // Check that both buttons are available
        await expect(page.locator('[data-testid="continueToManualButton"]')).toBeVisible();
        await expect(page.locator('[data-testid="goToHomeButton"]')).toBeVisible();
    });

    test('should show rejection result when rejection condition is met', async ({ page }) => {
        // Start the quiz from home page
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz');

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1');

        // Select the third option (Patchy) which has isRejection: true
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-2"]', '/quiz/results');

        // Verify rejection message is visible
        await expect(page.locator('[data-testid="rejectionMessage"]')).toContainText(
            'Unfortunately, we are unable to prescribe this medication for you'
        );

        // Verify only the Retake Assessment button is shown
        await expect(page.locator('[data-testid="retakeQuizButton"]')).toBeVisible();
        await expect(page.locator('[data-testid="goToHomeButton"]')).toHaveCount(0);
    });

    test('should allow navigation back to previous questions', async ({ page }) => {
        // Start the quiz
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz');

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1');

        // Answer the first question
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-0"]', '/quiz/2');

        // Click the back button
        await page.locator('[data-testid="backButton"]').click();
        await expect(page).toHaveURL('/quiz/1', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // Verify the previously selected option is highlighted
        await expect(page.locator('[data-testid="quizOption-0"]')).toHaveClass(/optionSelected/);
    });

    test('should persist answers when navigating between questions', async ({ page }) => {
        // Start the quiz
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz');

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1');

        // Answer the first question with first option
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-0"]', '/quiz/2');

        // Answer the second question with second option
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/3');

        // Go back to question 2
        await page.locator('[data-testid="backButton"]').click();
        await expect(page).toHaveURL('/quiz/2', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // Verify the correct option is selected in question 2
        await expect(page.locator('[data-testid="quizOption-1"]')).toHaveClass(/optionSelected/);

        // Go back to question 1
        await page.locator('[data-testid="backButton"]').click();
        await expect(page).toHaveURL('/quiz/1', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // Verify the correct option is selected in question 1
        await expect(page.locator('[data-testid="quizOption-0"]')).toHaveClass(/optionSelected/);
    });

    test('should reset quiz when clicking "Retake Assessment" from rejection results', async ({ page }) => {
        // Start the quiz
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz');

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1');

        // Select a rejection option
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-2"]', '/quiz/results');

        // At results page, click the retake button
        await page.locator('[data-testid="retakeQuizButton"]').click();
        await expect(page).toHaveURL('/quiz', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // Start the quiz again
        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // No options should be selected in the first question (quiz was reset)
        await expect(page.locator('.optionSelected')).toHaveCount(0);
    });

    test('should navigate to Manual website when clicking "Continue to Manual.co"', async ({ page }) => {
        // Start the quiz
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz');

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1');

        // Complete the quiz with non-rejection answers
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-0"]', '/quiz/2');
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/3');
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/results');

        // Create a promise to capture new page
        const pagePromise = page.context().waitForEvent('page');

        // Click on "Continue to Manual.co" button which should open a new tab
        await page.locator('[data-testid="continueToManualButton"]').click();

        // Get the new page (opened in a new tab)
        const newPage = await pagePromise;

        // Wait for the new page to load
        await newPage.waitForLoadState('domcontentloaded', { timeout: navigationTimeout });

        // Verify the URL of the new page starts with manual.co
        expect(newPage.url()).toContain('manual.co');
    });

    test('should return to home page when clicking "Go to home Page"', async ({ page }) => {
        // Start the quiz
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz');

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1');

        // Complete the quiz with non-rejection answers
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-0"]', '/quiz/2');
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/3');
        await selectOptionAndWaitForNavigation(page, '[data-testid="quizOption-1"]', '/quiz/results');

        // Click on "Go to home Page" button
        await page.locator('[data-testid="goToHomeButton"]').click();
        await expect(page).toHaveURL('/', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // Start the quiz again to verify it was reset
        await page.locator('[data-testid="buttonCallToAction"]').click();
        await expect(page).toHaveURL('/quiz', { timeout: navigationTimeout });

        await page.locator('[data-testid="startAssessmentButton"]').click();
        await expect(page).toHaveURL('/quiz/1', { timeout: navigationTimeout });
        await page.waitForTimeout(300);

        // No options should be selected in the first question (quiz was reset)
        await expect(page.locator('.optionSelected')).toHaveCount(0);
    });
});
