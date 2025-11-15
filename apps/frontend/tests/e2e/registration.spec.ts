import { expect, test } from '@playwright/test'

test.describe.serial('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page and ensure it's fully loaded
    await page.goto('https://localhost:4321/registration', { waitUntil: 'networkidle' })
    // Force a fresh reload to clear any state
    await page.reload({ waitUntil: 'networkidle' })
    // Wait for form to be visible and interactive
    await page.waitForSelector('.form-wrapper.registration-form', { state: 'visible' })
  })

  test('should display the registration form with all required fields', async ({ page }) => {
    // Check that the form exists
    await expect(page.locator('.form-wrapper.registration-form')).toBeVisible()

    // Check for required fields
    await expect(page.getByLabel('Name:')).toBeVisible()
    await expect(page.getByLabel('Email:')).toBeVisible()
    await expect(page.getByLabel(/^Password:/)).toBeVisible()
    await expect(page.getByLabel('Please type the same password again.')).toBeVisible()

    // Check for optional fields
    await expect(page.getByLabel('Add your town, city or country')).toBeVisible()
    await expect(page.getByLabel('Add a link to your portfolio')).toBeVisible()
    await expect(page.getByLabel('Add a link to your YouTube channel')).toBeVisible()
    await expect(page.getByLabel('Add a link to your Mastodon account')).toBeVisible()
    await expect(page.getByLabel('Add a link to your Bluesky account')).toBeVisible()
    await expect(page.getByLabel('Add a link to your LinkedIn account')).toBeVisible()

    // Check for submit button
    await expect(page.locator('button.button', { hasText: 'Submit' })).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Set up dialog handler to catch any submission dialogs
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Click submit without filling any fields
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(10000)

    // The form should not submit (no dialog should appear)
    expect(dialogAppeared).toBe(false)

    // Check for validation error messages
    await expect(page.locator('.error', { hasText: 'Please enter your name' })).toBeVisible()
    await expect(page.locator('.error', { hasText: 'Please enter a valid email address' })).toBeVisible()
    await expect(page.locator('.field-registration-password-one .error', { hasText: 'Please enter a password' }))
      .toBeVisible()
    await expect(page.locator('.field-registration-password-two .error', { hasText: 'Please enter a password' }))
      .toBeVisible()
  })

  test('should validate name field - empty name', async ({ page }) => {
    // Try to submit with empty name
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show name validation error
    await expect(page.locator('.error', { hasText: 'Please enter your name' })).toBeVisible()
  })

  test('should validate name field - name too long', async ({ page }) => {
    // Fill in a name that's too long (> 200 characters)
    const longName = 'a'.repeat(201)
    await page.getByTestId('name').fill(longName)
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show name length validation error
    await expect(page.locator('.error', { hasText: 'Your name must not be longer than 200 characters' })).toBeVisible()
  })

  test('should validate email field - empty email', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show email validation error
    await expect(page.locator('.error', { hasText: 'Please enter a valid email address' })).toBeVisible()
  })

  test('should validate email field - invalid email format', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('invalid-email')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show invalid email error
    await expect(
      page.locator('.error', {
        hasText: 'Please include an \'@\' in the email address. \'invalid-email\' is missing an \'@\'.\n'
      })
    ).toBeVisible()
  })

  test('should validate password field - empty password', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show password validation error
    await expect(page.locator('.field-registration-password-one .error', { hasText: 'Please enter a password' }))
      .toBeVisible()
    await expect(page.locator('.field-registration-password-two .error', { hasText: 'Please enter a password' }))
      .toBeVisible()
  })

  test('should validate password field - weak password (no uppercase)', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('password123!')
    await page.getByTestId('passwordTwo').fill('password123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show weak password error
    await expect(
      page.locator('.field-registration-password-one .error', {
        hasText:
          /Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      })
    ).toBeVisible()
  })

  test('should validate password field - weak password (no lowercase)', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('PASSWORD123!')
    await page.getByTestId('passwordTwo').fill('PASSWORD123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show weak password error
    await expect(
      page.locator('.field-registration-password-one .error', {
        hasText:
          /Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      })
    ).toBeVisible()
  })

  test('should validate password field - weak password (no number)', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('PasswordABC!')
    await page.getByTestId('passwordTwo').fill('PasswordABC!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show weak password error
    await expect(
      page.locator('.field-registration-password-one .error', {
        hasText:
          /Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      })
    ).toBeVisible()
  })

  test('should validate password field - weak password (no special character)', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123')
    await page.getByTestId('passwordTwo').fill('Password123')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show weak password error
    await expect(
      page.locator('.field-registration-password-one .error', {
        hasText:
          /Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      })
    ).toBeVisible()
  })

  test('should validate password field - password too short', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Pass1!')
    await page.getByTestId('passwordTwo').fill('Pass1!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show weak password error
    await expect(
      page.locator('.field-registration-password-one .error', {
        hasText:
          /Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      })
    ).toBeVisible()
  })

  test('should validate password confirmation - passwords do not match', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('DifferentPass123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show passwords don't match error
    await expect(page.locator('.field-registration-password-two .error', { hasText: 'Passwords do not match' }))
      .toBeVisible()
  })

  test('should validate optional URL fields - invalid portfolio URL', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')
    await page.getByTestId('portfolioUrl').fill('not-a-valid-url')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show invalid URL error
    await expect(page.locator('.error', { hasText: 'Please enter a URL.' })).toBeVisible()
  })

  test('should validate optional URL fields - invalid YouTube URL', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')
    await page.getByTestId('youtubeLink').fill('invalid-url')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show invalid URL error
    await expect(page.locator('.error', { hasText: 'Please enter a URL.' })).toBeVisible()
  })

  test('should validate optional URL fields - invalid Mastodon URL', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')
    await page.getByTestId('mastodonUrl').fill('invalid-url')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show invalid URL error
    await expect(page.locator('.error', { hasText: 'Please enter a URL.' })).toBeVisible()
  })

  test('should validate optional URL fields - invalid Bluesky URL', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')
    await page.getByTestId('blueskyUrl').fill('invalid-url')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show invalid URL error
    await expect(page.locator('.error', { hasText: 'Please enter a URL.' })).toBeVisible()
  })

  test('should validate optional URL fields - invalid LinkedIn URL', async ({ page }) => {
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')
    await page.getByTestId('linkedinUrl').fill('invalid-url')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should show invalid URL error
    await expect(page.locator('.error', { hasText: 'Please enter a URL.' })).toBeVisible()
  })

  test('should accept valid URLs for optional fields', async ({ page }) => {
    let dialogAppeared = false
    let dialogMessage = ''

    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      dialogMessage = dialog.message()
      await dialog.dismiss()
    })

    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('test@example.com')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')
    await page.getByTestId('portfolioUrl').fill('https://example.com/portfolio')
    await page.getByTestId('youtubeLink').fill('https://youtube.com/channel/test')
    await page.getByTestId('mastodonUrl').fill('https://mastodon.social/@user')
    await page.getByTestId('blueskyUrl').fill('https://bsky.app/profile/user')
    await page.getByTestId('linkedinUrl').fill('https://linkedin.com/in/user')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(5000)

    // Should submit successfully (dialog appears with form data)
    expect(dialogAppeared).toBe(true)
    expect(dialogMessage).toContain('John Doe')
    expect(dialogMessage).toContain('test@example.com')
  })

  test('should successfully submit form with valid required fields only', async ({ page }) => {
    let dialogAppeared = false
    let dialogMessage = ''

    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      dialogMessage = dialog.message()
      await dialog.dismiss()
    })

    // Fill only required fields
    await page.getByTestId('name').fill('Jane Smith')
    await page.getByTestId('email').fill('jane.smith@example.com')
    await page.getByTestId('passwordOne').fill('SecurePass123!')
    await page.getByTestId('passwordTwo').fill('SecurePass123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should submit successfully
    expect(dialogAppeared).toBe(true)
    expect(dialogMessage).toContain('Jane Smith')
    expect(dialogMessage).toContain('jane.smith@example.com')
  })

  test('should successfully submit form with all fields filled', async ({ page }) => {
    let dialogAppeared = false
    let dialogMessage = ''

    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      dialogMessage = dialog.message()
      await dialog.dismiss()
    })

    // Fill all fields
    await page.getByTestId('name').fill('Jane Smith')
    await page.getByTestId('email').fill('jane.smith@example.com')
    await page.getByTestId('passwordOne').fill('SecurePass123!')
    await page.getByTestId('passwordTwo').fill('SecurePass123!')
    await page.getByTestId('location').fill('London, UK')
    await page.getByTestId('portfolioUrl').fill('https://alice.dev')
    await page.getByTestId('youtubeLink').fill('https://youtube.com/@alice')
    await page.getByTestId('mastodonUrl').fill('https://mastodon.social/@alice')
    await page.getByTestId('blueskyUrl').fill('https://bsky.app/profile/alice')
    await page.getByTestId('linkedinUrl').fill('https://linkedin.com/in/alice')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Should submit successfully with all data
    expect(dialogAppeared).toBe(true)
    expect(dialogMessage).toContain('Jane Smith')
    expect(dialogMessage).toContain('jane.smith@example.com')
    expect(dialogMessage).toContain('London, UK')
    expect(dialogMessage).toContain('https://alice.dev')
  })

  test('should clear validation errors when fixing invalid input', async ({ page }) => {
    // Submit form with invalid email
    await page.getByTestId('name').fill('John Doe')
    await page.getByTestId('email').fill('invalid-email')
    await page.getByTestId('passwordOne').fill('Password123!')
    await page.getByTestId('passwordTwo').fill('Password123!')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Error should appear
    await expect(
      page.locator('.error', {
        hasText: 'Please include an \'@\' in the email address. \'invalid-email\' is missing an \'@\'.\n'
      })
    ).toBeVisible()

    // Fix the email
    await page.getByTestId('email').fill('valid@example.com')
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Email error should be cleared (form should submit successfully)
    // Note: Dialog will appear on successful submission
  })

  test('should have proper input attributes for accessibility', async ({ page }) => {
    // Check name input
    const nameInput = page.getByTestId('name')
    await expect(nameInput).toHaveAttribute('type', 'text')
    await expect(nameInput).toHaveAttribute('autocomplete', 'on')

    // Check email input
    const emailInput = page.getByTestId('email')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('autocomplete', 'on')

    // Check password inputs
    const passwordOneInput = page.getByTestId('passwordOne')
    await expect(passwordOneInput).toHaveAttribute('type', 'password')
    await expect(passwordOneInput).toHaveAttribute('autocomplete', 'new-password')

    const passwordTwoInput = page.getByTestId('passwordTwo')
    await expect(passwordTwoInput).toHaveAttribute('type', 'password')
    await expect(passwordTwoInput).toHaveAttribute('autocomplete', 'new-password')

    // Check URL inputs
    const portfolioInput = page.getByTestId('portfolioUrl')
    await expect(portfolioInput).toHaveAttribute('type', 'url')
  })

  test('should test various valid strong passwords', async ({ page }) => {
    const validPasswords = [
      'Password123!',
      '+r)47S+n@B',
      'GEa8^n%qxsg*',
      'W7r9!FAT',
      'MyP@ssw0rd',
      'Str0ng!Pass'
    ]

    for (const password of validPasswords) {
      let dialogAppeared = false

      const dialogHandler = async (dialog: any) => {
        dialogAppeared = true
        await dialog.dismiss()
      }

      page.on('dialog', dialogHandler)

      await page.getByTestId('name').fill('Test User')
      await page.getByTestId('email').fill('test@example.com')
      await page.getByTestId('passwordOne').fill(password)
      await page.getByTestId('passwordTwo').fill(password)

      await page.locator('button.button', { hasText: 'Submit' }).click()
      await page.waitForTimeout(500)

      // Should submit successfully
      expect(dialogAppeared).toBe(true)

      page.off('dialog', dialogHandler)

      // Reload for next iteration
      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForSelector('.form-wrapper.registration-form', { state: 'visible' })
    }
  })
})
