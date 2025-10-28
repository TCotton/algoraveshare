import { test, expect } from '@playwright/test'

interface SubmitSnippetFormData {
  snippetName: string
  description: string
  projectSoftware: string
  codeBlock: string
  audioUpload?: string
  youtubeLink?: string
}

test.describe.serial('Submit Snippet Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page and ensure it's fully loaded
    await page.goto('http://localhost:4321/submit-snippet', { waitUntil: 'networkidle' })
    // Force a fresh reload to clear any state
    await page.reload({ waitUntil: 'networkidle' })
    // Wait for form to be visible and interactive
    await page.waitForSelector('.submit-snippet-form', { state: 'visible' })
  })

  test('should display the form with all initial elements', async ({ page }) => {
    // Check that the form exists
    await expect(page.locator('.submit-snippet-form')).toBeVisible()

    // Check for snippet name input
    await expect(page.locator('.field-registration-name').getByLabel('Snippet title:')).toBeVisible()
    await expect(page.getByPlaceholder('Title for snippet')).toBeVisible()

    // Check for project software select
    await expect(page.getByText('Choose the project software')).toBeVisible()

    // Check for code block textarea
   // await expect(page.locator('.form-textarea:first-of-type').getByLabel('Code block')).toBeVisible()
    await expect(page.getByPlaceholder('Add code here...')).toBeVisible()

    // Check for audio upload field
    await expect(page.getByText(/Audio upload/i)).toBeVisible()

    // Check for YouTube link field
    await expect(page.getByLabel('Add a URL of a relevant YouTube video')).toBeVisible()

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
    await page.waitForTimeout(500)

    // The form should not submit (no dialog should appear)
    expect(dialogAppeared).toBe(false)

    // Verify required field validation errors are shown
    await expect(page.getByText('Please select the project software')).toBeVisible()
  })

  test('should validate snippet name is required', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in other fields but leave snippet name empty
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.getByPlaceholder('Add code here...').fill('some code')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for snippet name validation error
    await expect(page.getByText('A snippet title is required')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })

  test('should validate snippet name length (max 200 characters)', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in a name that's too long (> 200 characters)
    const longName = 'a'.repeat(201)
    await page.getByTestId('name').fill(longName)

    // Fill in other required fields
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.getByPlaceholder('Add code here...').fill('some code')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for length validation error
    await expect(page.getByText('The project name must not be longer than 200 characters')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })

  test('should validate project software selection', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in snippet name and code block but don't select project software
    await page.getByTestId('name').fill('Test Snippet')
    await page.getByPlaceholder('Add code here...').fill('some code')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for project software validation error
    await expect(page.getByText('Please select the project software')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })

  test('should validate code block is required', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in snippet name and project software but leave code block empty
    await page.getByTestId('name').fill('Test Snippet')
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for code block validation error
    await expect(page.getByText('Don\'t forget to add your code!')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })

  test('should show description field when Tidal Cycles is selected', async ({ page }) => {
    // Initially description field should not be visible
    const descriptionTextarea = page.getByPlaceholder('Add description here...')
    await expect(descriptionTextarea).not.toBeVisible()

    // Select Tidal Cycles
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()

    // Wait for description field to appear
    await page.waitForTimeout(300)

    // Description field should now be visible
    await expect(descriptionTextarea).toBeVisible()

    // Check for Tidal Cycles specific content
    await expect(page.locator('.description-text .tidal-cycles')).toBeVisible()
    await expect(page.locator('.description-text .strudel')).not.toBeVisible()
  })

  test('should show description field when Strudel is selected', async ({ page }) => {
    // Initially description field should not be visible
    const descriptionTextarea = page.getByPlaceholder('Add description here...')
    await expect(descriptionTextarea).not.toBeVisible()

    // Select Strudel
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()

    // Wait for description field to appear
    await page.waitForTimeout(300)

    // Description field should now be visible
    await expect(descriptionTextarea).toBeVisible()

    // Check for Strudel specific content
    await expect(page.locator('.description-text .tidal-cycles')).not.toBeVisible()
    await expect(page.locator('.description-text .strudel')).toBeVisible()
  })

  test('should hide description field when Project software default is selected', async ({ page }) => {
    // Select Tidal Cycles first
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.waitForTimeout(300)

    // Verify description is visible
    const descriptionTextarea = page.getByPlaceholder('Add description here...')
    await expect(descriptionTextarea).toBeVisible()

    // Change back to default
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.project-software').click()
    await page.waitForTimeout(300)

    // Description should now be hidden
    await expect(descriptionTextarea).not.toBeVisible()
  })

  test('should validate YouTube link URL format', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in required fields
    await page.getByTestId('name').fill('Test Snippet')
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.getByPlaceholder('Add code here...').fill('some code')

    // Add invalid YouTube link
    await page.getByPlaceholder('Link to YouTube video').fill('not-a-valid-url')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for YouTube link validation error
    await expect(page.getByText('Are you sure that URL is correct?')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })

  test('should successfully submit with valid Strudel snippet data', async ({ page }) => {
    // Set up dialog handler to capture the submission
    let dialogMessage = ''
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    // Fill in all required fields for Strudel
    const snippetName = 'My Strudel Snippet'
    const codeBlock = 's("bd sd").fast(2)'
    const description = 'This is a basic drum pattern'

    await page.getByTestId('name').fill(snippetName)

    // Select Strudel
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(300)

    // Fill in code block and description
    await page.getByPlaceholder('Add code here...').fill(codeBlock)
    await page.getByPlaceholder('Add description here...').fill(description)

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for the dialog to appear
    await page.waitForTimeout(1000)

    // Verify the dialog appeared with correct data
    expect(dialogMessage).toBeTruthy()

    const data = JSON.parse(dialogMessage) as SubmitSnippetFormData
    expect(data.snippetName).toBe(snippetName)
    expect(data.projectSoftware).toBe('Strudel')
    expect(data.codeBlock).toBe(codeBlock)
    expect(data.description).toBe(description)
  })

  test('should successfully submit with valid Tidal Cycles snippet data', async ({ page }) => {
    // Set up dialog handler to capture the submission
    let dialogMessage = ''
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    // Fill in all required fields for Tidal Cycles
    const snippetName = 'My Tidal Snippet'
    const codeBlock = 'd1 $ sound "bd sd"'
    const description = 'Basic Tidal pattern'

    await page.getByTestId('name').fill(snippetName)

    // Select Tidal Cycles
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.waitForTimeout(300)

    // Fill in code block and description
    await page.getByPlaceholder('Add code here...').fill(codeBlock)
    await page.getByPlaceholder('Add description here...').fill(description)

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for the dialog to appear
    await page.waitForTimeout(1000)

    // Verify the dialog appeared with correct data
    expect(dialogMessage).toBeTruthy()

    const data = JSON.parse(dialogMessage) as SubmitSnippetFormData
    expect(data.snippetName).toBe(snippetName)
    expect(data.projectSoftware).toBe('Tidal Cycles')
    expect(data.codeBlock).toBe(codeBlock)
    expect(data.description).toBe(description)
  })

  test('should successfully submit with valid YouTube link', async ({ page }) => {
    // Set up dialog handler to capture the submission
    let dialogMessage = ''
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    // Fill in all required fields
    const snippetName = 'Snippet with YouTube'
    const codeBlock = 's("bd sd")'
    const youtubeLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    await page.getByTestId('name').fill(snippetName)

    // Select Strudel (no description required)
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(300)

    // Fill in code block and YouTube link
    await page.getByPlaceholder('Add code here...').fill(codeBlock)
    await page.getByPlaceholder('Add description here...').fill('Test description')
    await page.getByPlaceholder('Link to YouTube video').fill(youtubeLink)

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()

    // Wait for the dialog to appear
    await page.waitForTimeout(1000)

    // Verify the dialog appeared with correct data
    expect(dialogMessage).toBeTruthy()

    const data = JSON.parse(dialogMessage) as SubmitSnippetFormData
    expect(data.snippetName).toBe(snippetName)
    expect(data.youtubeLink).toBe(youtubeLink)
  })

  test('should allow typing in snippet name field', async ({ page }) => {
    const testName = 'Test Snippet Name'

    await page.getByTestId('name').fill(testName)
    await expect(page.getByTestId('name')).toHaveValue(testName)
  })

  test('should allow typing in code block textarea', async ({ page }) => {
    const testCode = 'd1 $ sound "bd sd hh cp"'

    await page.getByTestId('codeBlock').fill(testCode)
    await expect(page.getByPlaceholder('Add code here...')).toHaveValue(testCode)
  })

  test('should allow typing in description textarea when visible', async ({ page }) => {
    // Select Tidal Cycles to make description visible
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.waitForTimeout(300)

    const testDescription = 'This is a test description for my snippet'

    await page.getByTestId('description').fill(testDescription)
    await expect(page.getByTestId('description')).toHaveValue(testDescription)
  })

  test('should have correct autocomplete attributes', async ({ page }) => {
    // Check snippet name input has autocomplete
    const nameInput = page.getByTestId('name')
    await expect(nameInput).toHaveAttribute('autocomplete', 'on')

    // Check YouTube link has autocomplete off
    const youtubeInput = page.getByPlaceholder('Link to YouTube video')
    await expect(youtubeInput).toHaveAttribute('autocomplete', 'off')
  })

  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    // Check form has aria-labelledby
    const form = page.locator('.submit-snippet-form')
    await expect(form).toHaveAttribute('aria-labelledby', 'add-new-snippet')

    // Check that labels are properly associated field-registration-name form-codeblock
    await expect(page.locator('.field-registration-name').getByLabel('Snippet title:')).toBeVisible()
  })

  test('should clear validation errors when valid input is entered', async ({ page }) => {
    // First trigger validation errors by submitting empty form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Verify errors are shown
    await expect(page.getByText('A snippet title is required')).toBeVisible()
    await expect(page.getByText('Please select the project software')).toBeVisible()

    // Now fill in valid data
    await page.getByTestId('name').fill('Valid Snippet Name')
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(300)
    await page.getByPlaceholder('Add code here...').fill('valid code')
    await page.getByPlaceholder('Add description here...').fill('valid description')

    // Submit again
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Errors should be cleared
    await expect(page.getByText('A snippet title is required')).not.toBeVisible()
    await expect(page.getByText('Please select the project software')).not.toBeVisible()
  })

  test('should validate description is required when Tidal Cycles is selected', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in required fields
    await page.getByTestId('name').fill('Test Snippet')
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.waitForTimeout(300)
    await page.getByPlaceholder('Add code here...').fill('some code')

    // Leave description empty

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for description validation error
    await expect(page.getByText('Description is required')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })

  test('should validate description is required when Strudel is selected', async ({ page }) => {
    // Set up dialog handler
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })

    // Fill in required fields
    await page.getByTestId('name').fill('Test Snippet')
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(300)
    await page.getByPlaceholder('Add code here...').fill('some code')

    // Leave description empty

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(500)

    // Check for description validation error
    await expect(page.getByText('Description is required')).toBeVisible()
    expect(dialogAppeared).toBe(false)
  })
})
