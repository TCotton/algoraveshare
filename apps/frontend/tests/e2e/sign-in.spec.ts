import { expect, test } from '@playwright/test'

interface SignInFormData {
  email: string
  passwordOne: string
}

test.describe.serial('Sign In Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the sign-in page and ensure it's fully loaded
    await page.goto('https://localhost:4321/sign-in', { waitUntil: 'networkidle' })
    // Force a fresh reload to clear any state
    await page.reload({ waitUntil: 'networkidle' })
    // Wait for form to be visible and interactive
    await page.waitForSelector('.sign-in-form', { state: 'visible' })
  })

  test('should display the sign-in form with all required elements', async ({ page }) => {
    // Check that the form exists
    await expect(page.locator('.sign-in-form')).toBeVisible()

    // Check for email field
    await expect(page.getByLabel('Email:')).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()

    // Check for password field
    await expect(page.getByLabel('Password:')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()

    // Check for submit button
    await expect(page.locator('button.button', { hasText: 'Submit' })).toBeVisible()
  })

  test('should show validation error when submitting with empty email', async ({ page }) => {
    // Set up dialog handler to catch any submission dialogs
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in password only
    await page.getByTestId('passwordOne').fill('testpassword123')

    // Click submit without filling email
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for email validation error
    const emailError = page.locator('.field-signin-email .error')
    await expect(emailError).toBeVisible()
    await expect(emailError).toContainText('Please enter a valid email address')

    // The form should not submit (no dialog should appear)
    expect(dialogAppeared).toBe(false)
  })

  test('should show validation error when submitting with invalid email format', async ({ page }) => {
    // Set up dialog handler to catch any submission dialogs
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in invalid email
    await page.getByTestId('email').fill('not-a-valid-email')
    await page.getByTestId('passwordOne').fill('testpassword123')

    // Click submit
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for email validation error
    const emailError = page.locator('.field-signin-email .error')
    await expect(emailError).toBeVisible()
    await expect(emailError).toContainText(
      'Please include an \'@\' in the email address. \'not-a-valid-email\' is missing an \'@\'.'
    )

    // The form should not submit
    expect(dialogAppeared).toBe(false)
  })

  test('should show validation error when submitting with empty password', async ({ page }) => {
    // Set up dialog handler to catch any submission dialogs
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in email only
    await page.getByTestId('email').fill('test@example.com')

    // Click submit without filling password
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for password validation error
    const passwordError = page.locator('.field-signin-password-one .error')
    await expect(passwordError).toBeVisible()
    await expect(passwordError).toContainText('Please enter a password')

    // The form should not submit
    expect(dialogAppeared).toBe(false)
  })

  test('should successfully submit with valid email and password', async ({ page }) => {
    // Set up dialog handler to capture the submission
    let dialogMessage = ''
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    // Fill in valid credentials
    const testEmail = 'user@example.com'
    const testPassword = 'mySecurePassword123'

    await page.getByTestId('email').fill(testEmail)
    await page.getByTestId('passwordOne').fill(testPassword)

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for the dialog to appear
    await page.waitForTimeout(1000)

    // Verify the dialog appeared with correct data
    expect(dialogMessage).toBeTruthy()

    const data = JSON.parse(dialogMessage) as SignInFormData
    expect(data.email).toBe(testEmail)
    expect(data.passwordOne).toBe(testPassword)
  })

  test('should clear error messages when valid input is entered', async ({ page }) => {
    // First trigger validation errors by submitting empty form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Verify errors are shown
    const emailError = page.locator('.field-signin-email .error')
    await expect(emailError).toBeVisible()

    // Now fill in valid email
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('password123')

    // Submit again
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Error should be cleared or hidden
    await expect(emailError).not.toBeVisible()
  })

  test('should have correct input types and autocomplete attributes', async ({ page }) => {
    // Check email input has correct type
    const emailInput = page.getByTestId('email')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('autocomplete', 'username')

    // Check password input has correct type
    const passwordInput = page.getByTestId('passwordOne')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })

  test('should allow typing in both email and password fields', async ({ page }) => {
    const testEmail = 'testuser@example.com'
    const testPassword = 'MyTestPassword123!'

    // Type in email field
    await page.getByTestId('email').fill(testEmail)
    await expect(page.getByTestId('email')).toHaveValue(testEmail)

    // Type in password field
    await page.getByTestId('passwordOne').fill(testPassword)
    await expect(page.getByTestId('passwordOne')).toHaveValue(testPassword)
  })

  test('should handle email with whitespace correctly', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in email with only whitespace
    await page.getByTestId('email').fill('   ')
    await page.getByTestId('passwordOne').fill('password123')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show validation error for email
    const emailError = page.locator('.field-signin-email .error')
    await expect(emailError).toBeVisible()
    await expect(emailError).toContainText('Please enter a valid email address')

    // Form should not submit
    expect(dialogAppeared).toBe(false)
  })

  test('should handle password with whitespace correctly', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in password with only whitespace
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('   ')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show validation error for password
    const passwordError = page.locator('.field-signin-password-one .error')
    await expect(passwordError).toBeVisible()
    await expect(passwordError).toContainText('Please enter a password')

    // Form should not submit
    expect(dialogAppeared).toBe(false)
  })

  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    // Check form has aria-labelledby
    const form = page.locator('.sign-in-form')
    await expect(form).toHaveAttribute('aria-labelledby', 'sign-in-form')

    // Check that labels are properly associated with inputs
    const emailLabel = page.getByText('Email:')
    const passwordLabel = page.getByText('Password:')

    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()
  })
})
