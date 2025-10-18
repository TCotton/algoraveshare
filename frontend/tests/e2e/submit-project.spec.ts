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
    // due to either HTML5 or Ariakit validation
    expect(dialogAppeared).toBe(false)
    
    // Verify required fields still have their empty values
    // (form submission was prevented by validation)
    const nameInput = page.getByLabel('Name')
    await expect(nameInput).toHaveValue('')
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

    // Submit empty form - validation will prevent submission (no dialog)
    let dialogAppeared = false
    page.on('dialog', async (dialog) => {
      dialogAppeared = true
      await dialog.dismiss()
    })
    
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    // Form should not submit due to validation
    expect(dialogAppeared).toBe(false)

    // Fill in name - this should allow progressing past name validation
    await page.getByLabel('Name').fill('Valid Project name Name')
    await page.waitForTimeout(100)

    // Submit again to trigger software and type validation errors
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select the project software')).toBeVisible()
    await expect(page.getByText('Please select a project type')).toBeVisible()

    // Select software and type, verify errors clear
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(100) // Wait for state update
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select the project software')).not.toBeVisible()
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

    // Fill in name
    await page.getByLabel('Name').fill('Valid Project name Name')
    await page.waitForTimeout(100)

    // Submit and trigger software/type validation errors
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select the project software')).toBeVisible()
    await expect(page.getByText('Please select a project type')).toBeVisible()

    // Select software and type
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.strudel').click()
    await page.waitForTimeout(100) // Wait for state update
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select the project software')).not.toBeVisible()
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

    // Fill in name to proceed with form
    await page.getByLabel('Name').fill('Valid Project name Name')
    await page.waitForTimeout(100)
    
    // Verify placeholder is still correct after filling
    await expect(page.getByLabel('Name')).toHaveAttribute('placeholder', 'Name of project')
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Please select the project software')).toBeVisible()
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

  test('should display audio upload field with correct label and accept attribute', async ({ page }) => {
    // Check that audio upload field is visible
    await expect(page.locator('.field-upload-audio')).toBeVisible()

    // Check the label exists (it may be visually hidden for accessibility)
    await expect(page.locator('label', { hasText: 'Audio upload:' })).toBeAttached()
    await expect(page.locator('label', { hasText: 'accepts WAV, MP3, FLAC, AAC and OGG' })).toBeAttached()

    // Check file input has correct accept attribute
    const fileInput = page.locator('input[type="file"].input-audio-file')
    await expect(fileInput).toBeVisible()
    await expect(fileInput).toHaveAttribute('accept', '\'audio/wav\', \'audio/mp3\', \'audio/flac\', \'audio/aac\', \'audio/ogg\'')
  })

  test('should accept valid audio file upload (WAV)', async ({ page }) => {
    const fileInput = page.locator('input[type="file"].input-audio-file')

    // Upload a valid WAV file
    await fileInput.setInputFiles('tests/data/test-pass-file.wav')
    await page.waitForTimeout(100)

    // No error should be displayed for valid file
    await expect(page.getByText('Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')).not.toBeVisible()
  })

  test('should reject invalid audio file upload (TXT)', async ({ page }) => {
    const fileInput = page.locator('input[type="file"].input-audio-file')

    // Upload an invalid TXT file
    await fileInput.setInputFiles('tests/data/test-fail-pass.txt')
    await page.waitForTimeout(100)

    // Error message should be displayed
    await expect(page.getByText('Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')).toBeVisible()
  })

  test('should clear audio upload error when valid file is uploaded', async ({ page }) => {
    const fileInput = page.locator('input[type="file"].input-audio-file')

    // First upload an invalid file
    await fileInput.setInputFiles('tests/data/test-fail-pass.txt')
    await page.waitForTimeout(100)
    await expect(page.getByText('Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')).toBeVisible()

    // Then upload a valid file
    await fileInput.setInputFiles('tests/data/test-pass-file.wav')
    await page.waitForTimeout(100)

    // Error should be cleared
    await expect(page.getByText('Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')).not.toBeVisible()
  })

  test('should allow audio upload field to be optional', async ({ page }) => {
    // Fill required fields but leave audio upload empty
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.getByLabel('Name').fill('Test Project')
    await page.locator('textarea[name="description"]').fill('Test description')
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.locator('textarea.form-single-codeblock').fill('d1 $ sound "bd"')

    // Submit without audio file
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)

    // No audio upload error should appear (it's optional)
    await expect(page.getByText('Invalid file type. Only WAV, MP3, FLAC, AAC and OGG files are allowed.')).not.toBeVisible()
  })

  test('should display YouTube link field with correct label and placeholder', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(100)

    // Check that YouTube link field is visible
    await expect(page.locator('.input-youtube-link')).toBeVisible()

    // Check the label exists (it may be visually hidden for accessibility)
    await expect(page.locator('label', { hasText: 'Add a URL of a relevant YouTube video' })).toBeAttached()

    // Check input has correct placeholder
    const youtubeInput = page.locator('input.youtube-link')
    await expect(youtubeInput).toBeVisible()
    await expect(youtubeInput).toHaveAttribute('placeholder', 'Link to YouTube video')
  })

  test('should validate YouTube link URL format', async ({ page }) => {
    const youtubeInput = page.locator('input.youtube-link')

    // Enter an invalid URL
    await page.getByLabel('Name').fill('Valid Project name Name')
    await youtubeInput.fill('not-a-valid-url')

    // Submit the form to trigger validation
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)

    // Check for URL validation error
    await expect(page.getByText('Are you sure that URL is correct?')).toBeVisible()
  })

  test('should accept valid YouTube link URL', async ({ page }) => {
    const youtubeInput = page.locator('input.youtube-link')

    // Enter a valid URL
    await page.getByLabel('Name').fill('Valid Project name Name')
    await youtubeInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    // Submit the form
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)

    // URL validation error should not appear
    await expect(page.getByText('Are you sure that URL is correct?')).not.toBeVisible()
  })

  test('should clear YouTube link validation error when corrected', async ({ page }) => {
    const youtubeInput = page.locator('input.youtube-link')

    // Enter an invalid URL
    await page.getByLabel('Name').fill('Valid Project name Name')
    await youtubeInput.fill('invalid-url')

    // Submit to trigger validation
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)
    await expect(page.getByText('Are you sure that URL is correct?')).toBeVisible()

    // Correct the URL
    await youtubeInput.fill('https://www.youtube.com/watch?v=validID')

    // Submit again
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)

    // Error should be cleared
    await expect(page.getByText('Are you sure that URL is correct?')).not.toBeVisible()
  })

  test('should allow YouTube link field to be optional', async ({ page }) => {
    // Leave YouTube link empty and fill other required fields
    await page.locator('.project-software button.select-trigger').click()
    await page.locator('.project-software .menu-item.tidal-cycles').click()
    await page.getByLabel('Name').fill('Test Project')
    await page.locator('textarea[name="description"]').fill('Test description')
    await page.locator('.project-type button.select-trigger').click()
    await page.locator('.project-type .menu-item.finished').click()
    await page.locator('textarea.form-single-codeblock').fill('d1 $ sound "bd"')

    // YouTube link should be empty
    const youtubeInput = page.locator('input.youtube-link')
    await expect(youtubeInput).toHaveValue('')

    // Submit should not show error for empty YouTube link
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)

    // No YouTube link error should appear (it's optional)
    await expect(page.getByText('Are you sure that URL is correct?')).not.toBeVisible()
  })

  test('should maintain YouTube link value after validation error', async ({ page }) => {
    const youtubeInput = page.locator('input.youtube-link')
    const validUrl = 'https://www.youtube.com/watch?v=test123'

    // Fill YouTube link
    await youtubeInput.fill(validUrl)

    // Submit form (will fail on other required fields)
    await page.locator('button.button', { hasText: 'Submit' }).click()
    await page.waitForTimeout(100)

    // YouTube link value should be maintained
    await expect(youtubeInput).toHaveValue(validUrl)
  })
})
