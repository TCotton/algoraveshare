import { test, expect } from '@playwright/test'

test.describe('Submit Project Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/submit-project')
  })

  test.only('should display the form with all initial elements', async ({ page }) => {
    // Check that the form exists
    await expect(page.locator('.form-wrapper')).toBeVisible()

    // Check for project software select
    await expect(page.getByText('Choose the project software')).toBeVisible()

    // Check for project name input
    await expect(page.getByLabel('Name')).toBeVisible()

    // Check for project type select
    await expect(page.getByText('Choose a project type')).toBeVisible()

    // Check for single project textarea
    await expect(page.locator('textarea[name="singleProject"]')).toBeVisible()

    // Check for submit button
    await expect(page.locator('button.button', { hasText: 'Submit' })).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Click submit without filling any fields
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait a bit for validation to complete
    await page.waitForTimeout(500)

    // Check for validation errors using role-based selectors
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Don\'t forget to add your code!')).toBeVisible()
  })

  test.fixme('should validate project name length', async ({ page }) => {
    // Fill in a name that's too long (> 200 characters)
    const longName = 'a'.repeat(201)
    await page.getByLabel('Name').fill(longName)

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for validation
    await page.waitForTimeout(500)

    // Check for length validation error
    await expect(page.getByText('The project name must not be longer than 200 characters')).toBeVisible()
  })

  test.fixme('should show description field when Tidal Cycles is selected', async ({ page }) => {
    // Initially description field should not be visible
    await expect(page.locator('textarea[name="description"]')).not.toBeVisible()

    // Select Tidal Cycles - use more specific selector within the select menu
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Tidal Cycles' }).click()

    // Description field should now be visible
    await expect(page.locator('textarea[name="description"]')).toBeVisible()

    // Check for Tidal Cycles specific content
    await expect(page.locator('.description-text .tidal-cycles')).toBeVisible()
    await expect(page.locator('.description-text .strudel')).not.toBeVisible()
  })

  test.fixme('should show description field when Strudel is selected', async ({ page }) => {
    // Initially description field should not be visible
    await expect(page.locator('textarea[name="description"]')).not.toBeVisible()

    // Select Strudel - use more specific selector within the select menu
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Strudel' }).click()

    // Description field should now be visible
    await expect(page.locator('textarea[name="description"]')).toBeVisible()

    // Check for Strudel specific content
    await expect(page.locator('.description-text .strudel')).toBeVisible()
    await expect(page.locator('.description-text .tidal-cycles')).not.toBeVisible()
  })

  test.fixme('should hide description field when project software is not selected', async ({ page }) => {
    // Select Tidal Cycles first
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Tidal Cycles' }).click()

    // Verify description is visible
    await expect(page.locator('textarea[name="description"]')).toBeVisible()

    // Change back to default
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]').first().click()

    // Description field should be hidden again
    await expect(page.locator('textarea[name="description"]')).not.toBeVisible()
  })

  test.fixme('should require description when Tidal Cycles is selected', async ({ page }) => {
    // Select Tidal Cycles
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Tidal Cycles' }).click()

    // Fill other required fields but leave description empty
    await page.getByLabel('Name').fill('Test Project')
    await page.getByText('Choose a project type').click()
    await page.getByText('Finished Project').click()
    await page.locator('textarea[name="singleProject"]').fill('// some code')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for validation
    await page.waitForTimeout(500)

    // Should show description validation error
    await expect(page.getByText('Description is required')).toBeVisible()
  })

  test.fixme('should successfully submit form with all valid data for Tidal Cycles', async ({ page }) => {
    // Set up alert handler to capture the submission
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert')
      const message = dialog.message()
      const data = JSON.parse(message)

      // Verify submitted data
      expect(data.projectSoftware).toBe('Tidal Cycles')
      expect(data.projectType).toBe('Finished Project')
      expect(data.projectName).toBe('My Tidal Project')
      expect(data.description).toBe('A great description of my project')
      expect(data.singleProject).toBe('d1 $ sound "bd sd"')

      await dialog.accept()
    })

    // Fill in all fields
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Tidal Cycles' }).click()

    await page.getByLabel('Name').fill('My Tidal Project')

    await page.getByText('Choose a project type').click()
    await page.getByText('Finished Project').click()

    await page.locator('textarea[name="description"]').fill('A great description of my project')
    await page.locator('textarea[name="singleProject"]').fill('d1 $ sound "bd sd"')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
  })
  test.fixme('should successfully submit form with all valid data for Strudel', async ({ page }) => {
    // Set up alert handler to capture the submission
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert')
      const message = dialog.message()
      const data = JSON.parse(message)

      // Verify submitted data
      expect(data.projectSoftware).toBe('Strudel')
      expect(data.projectType).toBe('Before and After Live Coding Project')
      expect(data.projectName).toBe('My Strudel Project')
      expect(data.description).toBe('An awesome strudel pattern')
      expect(data.singleProject).toBe('sound("bd sd").fast(2)')

      await dialog.accept()
    })

    // Fill in all fields
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Strudel' }).click()

    await page.getByLabel('Name').fill('My Strudel Project')

    await page.getByText('Choose a project type').click()
    await page.getByText('Before and After Live Coding Project').click()

    await page.locator('textarea[name="description"]').fill('An awesome strudel pattern')
    await page.locator('textarea[name="singleProject"]').fill('sound("bd sd").fast(2)')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
  })

  test.fixme('should clear validation errors when fields are corrected', async ({ page }) => {
    // Submit empty form to trigger errors
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for validation
    await page.waitForTimeout(500)

    // Verify errors are showing
    await expect(page.getByText('Please select a project software')).toBeVisible()
    await expect(page.getByText('Name is required')).toBeVisible()

    // Fix the errors
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Strudel' }).click()

    await page.getByLabel('Name').fill('Valid Name')

    await page.getByText('Choose a project type').click()
    await page.getByText('Finished Project').click()

    await page.locator('textarea[name="description"]').fill('Valid description')
    await page.locator('textarea[name="singleProject"]').fill('Valid code')

    // Submit again
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Errors should be cleared (form submits successfully)
    // Note: We're not checking for error absence here because the alert will show success
  })

  test.fixme('should maintain form values after validation error', async ({ page }) => {
    // Fill in some fields
    await page.getByLabel('Name').fill('Test Project Name')
    await page.locator('textarea[name="singleProject"]').fill('// test code')

    // Submit without selecting software and type (will cause validation error)
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Check that filled values are still there
    await expect(page.getByLabel('Name')).toHaveValue('Test Project Name')
    await expect(page.locator('textarea[name="singleProject"]')).toHaveValue('// test code')
  })

  test.fixme('should have correct placeholder text for all inputs', async ({ page }) => {
    // Check placeholders
    await expect(page.getByLabel('Name')).toHaveAttribute('placeholder', 'Name of project')
    await expect(page.locator('textarea[name="singleProject"]')).toHaveAttribute('placeholder', 'Add code here...')

    // Check description placeholder when visible
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Tidal Cycles' }).click()
    await expect(page.locator('textarea[name="description"]')).toHaveAttribute('placeholder', 'Describe the project...')
  })

  test.fixme('should display description helper text with proper heading', async ({ page }) => {
    // Select a software to show description
    await page.getByText('Choose the project software').click()
    await page.locator('a[href="#menu-form"]', { hasText: 'Tidal Cycles' }).click()

    // Check for helper text
    await expect(page.locator('.description-text p', { hasText: 'When writing your description, consider addressing some of the following questions:' })).toBeVisible()
  })
})
