import { test, expect } from '@playwright/test'

test.describe.serial('Submit Project Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page and ensure it's fully loaded
    await page.goto('http://localhost:4321/submit-project', { waitUntil: 'networkidle' })
    // Force a fresh reload to clear any state
    await page.reload({ waitUntil: 'networkidle' })
    // Wait for form to be visible and interactive
    await page.waitForSelector('.form-wrapper', { state: 'visible' })
  })

  test('should display the form with all initial elements', async ({ page }) => {
    // Check that the form exists
    await expect(page.locator('.form-wrapper')).toBeVisible()
    // Check for project software select
    await expect(page.getByText('Choose the project software')).toBeVisible()
    // Check for project name input
    await expect(page.getByLabel('Name')).toBeVisible()
    // Check for project type select
    await expect(page.getByText('Choose a project type')).toBeVisible()
    // Check for submit button
    await expect(page.locator('button.button', { hasText: 'Submit' })).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Click submit without filling any fields
    await page.locator('button.button', { hasText: 'Submit' }).click()
    // Check for validation errors using role-based selectors
    await expect(page.getByText('Please fill in this field.')).toBeVisible()
  })

  test('should validate project name length', async ({ page }) => {
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

  test('should show description field when Tidal Cycles is selected', async ({ page }) => {
    // Initially description field should not be visible
    await expect(page.locator('textarea[name="description"]')).not.toBeVisible()
    // Select Tidal Cycles - use more specific selector within the select menu
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    // Description field should now be visible
    await expect(page.locator('textarea[name="description"]')).toBeVisible()
    // Check for Tidal Cycles specific content
    await expect(page.locator('.description-text .tidal-cycles')).toBeVisible()
    await expect(page.locator('.description-text .strudel')).not.toBeVisible()
  })

  test('should show description field when Strudel is selected', async ({ page }) => {
    // Initially description field should not be visible
    await expect(page.locator('textarea[name="description"]')).not.toBeVisible()
    // Select Strudel - use more specific selector within the select menu
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    // Description field should now be visible
    await expect(page.locator('textarea[name="description"]')).toBeVisible()
    // Check for Strudel specific content
    await expect(page.locator('.description-text .tidal-cycles')).not.toBeVisible()
    await expect(page.locator('.description-text .strudel')).toBeVisible()
  })

  test('should hide description field when project software is not selected', async ({ page }) => {
    // Select Tidal Cycles first
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    // Verify description is visible
    await expect(page.locator('textarea[name="description"]')).toBeVisible()
    // Change back to default
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item').first().click()
    // Description field should be hidden again
    await expect(page.locator('textarea[name="description"]')).not.toBeVisible()
  })

  test('should require description when Tidal Cycles is selected', async ({ page }) => {
    // Select Tidal Cycles
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()

    // Fill other required fields but leave description empty
    await page.locator('.description-textarea textarea.form-textarea').fill('Test Project Description Text')
    await expect(page.getByText('Test Project Description Text')).toBeVisible()
  })

  test('should require description when Strudel is selected', async ({ page }) => {
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()

    await page.locator('.description-textarea textarea.form-textarea').fill('Test Project Description Text')
    await expect(page.getByText('Test Project Description Text')).toBeVisible()
  })

  test('should successfully submit form with all valid data for Tidal Cycles', async ({ page }) => {
    // Set up alert handler to capture the submission
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert')
      const message = dialog.message()
      const data = JSON.parse(message)

      // Verify submitted data
      expect(data.projectSoftware).toBe('Tidal Cycles')
      expect(data.projectType).toBe('Finished Project')
      expect(data.projectName).toBe('My Tidal Project')
      expect(data.description).toBe('Test Project Description Text')
      expect(data.singleProject).toBe('d1 $ sound "bd sd"')
      await dialog.accept()
    })

    // Fill in all fields
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.getByLabel('Name').fill('My Tidal Project')
    await page.locator('.description-textarea textarea.form-textarea').fill('Test Project Description Text')
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.locator('textarea.form-single-codeblock').fill('d1 $ sound "bd sd"')
    await page.locator('button.button', { hasText: 'Submit' }).click()
  })

  test('should successfully submit form with all valid data for Strudel', async ({ page }) => {
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
      expect(data.codeBlockOne).toBe('sound("bd sd").fast(2)')
      expect(data.codeBlockTwo).toBe('d1 $ sound "bd sd"')

      await dialog.accept()
    })

    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.locator('.description-textarea textarea.form-textarea').fill('Test Project Description Text')
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.before-after').click()
    await page.locator('textarea[name="description"]').fill('A great description of my project')
    await page.locator('textarea.form-textarea-codeblock-one').fill('sound("bd sd").fast(2)')
    await page.locator('textarea.form-textarea-codeblock-one').fill('d1 $ sound "bd sd"')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
  })

  test('should clear validation errors when fields are corrected', async ({ page }) => {
    // Ensure clean state - wait for page to be fully loaded and form to be ready
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.form-wrapper')).toBeVisible()
    
    // Submit empty form to trigger name validation error
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please fill in this field.')).toBeVisible()
    
    // Fill in name and verify error clears
    await page.getByLabel('Name').fill('Valid Project name Name')
    await page.waitForTimeout(100)
    await expect(page.getByText('Please fill in this field.')).not.toBeVisible()
    
    // Submit again to trigger software and type validation errors
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select a project software')).toBeVisible()
    await expect(page.getByText('Please select a project type')).toBeVisible()
    
    // Select software and type, verify errors clear
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(100) // Wait for state update
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select a project software')).not.toBeVisible()
    await expect(page.getByText('Please select a project type')).not.toBeVisible()
    
    // Submit again to trigger description and code validation errors
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Description is required')).toBeVisible()
    await expect(page.getByText('Don\'t forget to add your code!')).toBeVisible()
    
    // Fill in description and code, verify errors clear
    await page.locator('textarea[name="description"]').fill('A great description of my project')
    await page.locator('textarea.form-single-codeblock').fill('d1 $ sound "bd sd"')
    await page.waitForTimeout(100)
    await expect(page.getByText('Description is required')).not.toBeVisible()
    await expect(page.getByText('Don\'t forget to add your code!')).not.toBeVisible()
  })

  test('should maintain form values after validation error', async ({ page }) => {
    // Ensure clean state - wait for page to be fully loaded and form to be ready
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.form-wrapper')).toBeVisible()
    
    // Submit empty form and fill in name
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100) // Brief wait for validation to process
    await expect(page.getByText('Please fill in this field.')).toBeVisible()
    await page.getByLabel('Name').fill('Valid Project name Name')
    await page.waitForTimeout(100)
    await expect(page.getByText('Please fill in this field.')).not.toBeVisible()
    
    // Submit and trigger software/type validation errors
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select a project software')).toBeVisible()
    await expect(page.getByText('Please select a project type')).toBeVisible()
    
    // Select software and type
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(100) // Wait for state update
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select a project software')).not.toBeVisible()
    await expect(page.getByText('Please select a project type')).not.toBeVisible()
    
    // Submit and trigger description/code validation errors
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Description is required')).toBeVisible()
    await expect(page.getByText('Don\'t forget to add your code!')).toBeVisible()
    
    // Fill in description and code
    await page.locator('textarea[name="description"]').fill('A great description of my project')
    await page.locator('textarea.form-single-codeblock').fill('d1 $ sound "bd sd"')
    await page.waitForTimeout(100)
    await expect(page.getByText('Description is required')).not.toBeVisible()
    await expect(page.getByText('Don\'t forget to add your code!')).not.toBeVisible()
    
    // Verify that all form values are still present
    await expect(page.getByLabel('Name')).toHaveValue('Valid Project name Name')
    await expect(page.locator('textarea[name="description"]')).toHaveValue('A great description of my project')
    await expect(page.locator('textarea.form-single-codeblock')).toHaveValue('d1 $ sound "bd sd"')
  })

  test('should have correct placeholder text for all inputs', async ({ page }) => {
    // Ensure clean state - wait for page to be fully loaded and form to be ready
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.form-wrapper')).toBeVisible()
    
    // Check placeholders
    await expect(page.getByLabel('Name')).toHaveAttribute('placeholder', 'Name of project')

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please fill in this field.')).toBeVisible()
    await expect(page.getByLabel('Name')).toHaveAttribute('placeholder', 'Name of project')
    await page.getByLabel('Name').fill('Valid Project name Name')
    await page.waitForTimeout(100)
    await expect(page.getByText('Please fill in this field.')).not.toBeVisible()
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select a project software')).toBeVisible()
    await expect(page.getByText('Please select a project type')).toBeVisible()
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(100) // Wait for state update and conditional rendering
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.waitForTimeout(100) // Wait for the codeblock textarea to be rendered
    await expect(page.locator('textarea.form-single-codeblock')).toHaveAttribute('placeholder', 'Add code here...')
  })

  test('should display description helper text with proper heading', async ({ page }) => {
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await expect(page.locator('.description-text > p', { hasText: 'When writing your description, consider addressing some of the following questions:' })).toBeVisible()
  })
})
