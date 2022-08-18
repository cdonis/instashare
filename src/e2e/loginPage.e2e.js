import { getRandomString } from '../utils/utils';

const BASE_URL          = `http://localhost:${process.env.PORT || 8000}`;
const SCREENSHOTS_PATH  = 'tests/screenshots';
const LOGIN_PAGE        = '/#/user/login';
const MAIN_PAGE         = '/#/';
const LOGIN_SUCCESSFUL_MSG = 'Successful login';
const LOGIN_FAILED_MSG  = 'Login failed';

describe('Login page tests', () => {
  // Global variables for tests
  let email;
  let password;

  beforeAll( async () => {
    // Define random gmail address and password to be used as valid credentials
    email = `${getRandomString(8)}@gmail.com`;
    password = `A1${getRandomString(8)}b*`;

    // Load login page
    await page.goto(`${BASE_URL}${LOGIN_PAGE}`);
  })

  /**
   * Clears fields used for credential and set it with values given by "newEmail" and "newPassword" 
   * @param string newEmail      New email to set in email input line
   * @param string newPassword   New password to set in password input line
   */
  const clearAndSetCredentials = async (newEmail, newPassword) => {
    // Gets "email" and "password" controls
    let emailInput = await page.$('#email');
    let passwordInput = await page.$('#password');
    
    // Clears previous values
    await emailInput.click({clickCount: 3});
    await emailInput.press('Backspace');
    await passwordInput.click({clickCount: 3});
    await passwordInput.press('Backspace');

    // Enters new values
    await emailInput.type(newEmail);
    await passwordInput.type(newPassword);
  }

  /**
   * Waits for a modal to load, checks its title versus a given string and finally close the modal
   * @param string  title to match
   */
  const checksForModalWithTitle = async (title) => {
    // Waits for the modal to load
    await page.waitForSelector('.ant-modal-root');

    // Gets modal title and checks versus parameter
    const modalTitle = await page.$eval('.ant-modal-confirm-title', el => el.textContent);
    expect(modalTitle).toMatch(title);
    
    await page.waitForTimeout(500);
    await page.screenshot({path: `${SCREENSHOTS_PATH}/modal-${title}.jpg`})

    // Close modal clicking OK button and wait for close
    await page.click('.ant-modal-confirm-btns button.ant-btn-primary');
    await page.waitForFunction(() => document.querySelector('.ant-modal-root') === null);
  }
  
  it(`Checks for correct layout`, async () => {
    // Wait for 'footer' element, the last section of page
    await page.waitForSelector('footer');

    // Check for correct background image
    const backgroundImage = await page.$eval(
      'div[class^="container"]',
      el => getComputedStyle(el).getPropertyValue('background-image')
    );
    expect(backgroundImage).toMatch("main_content.jpg");

    // Checks for all sections to be present
    const sections = [
      // 1. Header section with Logo
      'div[class^="container"] div[class^="content"] div[class^="top"] div[class^="header"] a[href="#/"] img[src="/logo.png"]',
      // 2. Main section 
      // 2.1 Sign in button
      'div[class^="container"] div[class^="content"] div[class^="main"] form div button.ant-btn-link',
      // 2.2 Sign up button
      'div[class^="container"] div[class^="content"] div[class^="main"] form button.ant-btn-primary',
      // 3. Footer section
      // 3.1 Links section
      'div[class^="container"] footer .ant-pro-global-footer .ant-pro-global-footer-links',
      // 3.2 Copyright section
      'div[class^="container"] footer .ant-pro-global-footer .ant-pro-global-footer-copyright',
    ];

    sections.forEach( async (sectionSelector) => {
      const haveSection = await page.evaluate(
        (selector) => document.querySelector(selector) !== null,
        sectionSelector
      )
      expect(haveSection).toBeTruthy();
    })
    await page.screenshot({path: `${SCREENSHOTS_PATH}/login_page.jpg`});
  });

  it("Checks for successfull sign up", async () => {
    // Clicks "Sign up" button and waits for sign up fields to appear
    const signupButtonSelector = "form button.ant-btn-primary";
    await page.click(signupButtonSelector);
    await page.waitForSelector('#email');

    // "email", "name", "newPassword", "confirmPassword" controls should be present after "Sign up" button clicked
    expect(await page.$('#email')).toBeTruthy();
    expect(await page.$('#name')).toBeTruthy();
    expect(await page.$('#newPassword')).toBeTruthy();
    expect(await page.$('#confirmPassword')).toBeTruthy();

    // Fills in sign up fields
    await page.type('#email', email);
    await page.type('#name', 'John Smith');
    await page.type('#newPassword', password);
    await page.type('#confirmPassword', password);

    await page.screenshot({path: `${SCREENSHOTS_PATH}/login_page_signup_fields.jpg`});

    // Clicks "Sign up" button to submit form and waits for navigation
    await page.click(signupButtonSelector);
    await page.waitForNavigation();

    // After sign up, user keep loged in and is presented to main page
    // Asserts system has navigated to main page
    expect(page.url()).toMatch(`${BASE_URL}${MAIN_PAGE}`);

    // Checks for a modal with title 'Welcome' to load
    await checksForModalWithTitle('Welcome');

    // Waits for main page finish to load. Pagination is the last section of "Files table", it is presented after "files" API response is received
    await page.waitForSelector('.ant-pagination', {timeout: 0});
    await page.screenshot({path: `${SCREENSHOTS_PATH}/main_page.jpg`});
  });

  it('check for correct logout', async () => { 
    // Gets logout option by hover the dropdown menu trigger area. Waits for the option to appear
    await page.hover('.ant-dropdown-trigger');
    await page.waitForSelector('li.ant-dropdown-menu-item[data-menu-id$="logout"]');

    // Hovers on logout option to select it and then clicks
    await page.waitForTimeout(500);
    await page.hover('li.ant-dropdown-menu-item[data-menu-id$="logout"]');
    await page.waitForSelector('.ant-dropdown-menu-item-active');
    await page.click('.ant-dropdown-menu-item-active');
    await page.waitForNavigation();

    // Checks browser has navigated to login page
    expect(page.url()).toMatch(`${BASE_URL}${LOGIN_PAGE}`);
  });

  it('check for wrong sign up: existing user', async () => {
    // Clicks "Sign up" button and waits for sign up fields to appear
    const SIGNUP_BUTTON_SELECTOR = "form button.ant-btn-primary";
    await page.click(SIGNUP_BUTTON_SELECTOR);
    await page.waitForSelector('#email');

    // Fills in sign up fields
    await page.type('#email', email);
    await page.type('#name', 'John Smith');
    await page.type('#newPassword', password);
    await page.type('#confirmPassword', password);

    // Clicks "Sign up" button to submit form. Wait for navigation
    await page.click(SIGNUP_BUTTON_SELECTOR);

    // Checks for a modal with title containing string "Request failed" to load
    await checksForModalWithTitle('Request failed');

    // User should remains in the login page
    expect(page.url()).toMatch(`${BASE_URL}${LOGIN_PAGE}`);
  })

  it('check for wrong login: invalid credentials', async () => {
    // Checks for sign-In button and click it
    const signInButton = await page.$("form div button.ant-btn-link");
    expect(signInButton).toBeTruthy();
    await signInButton.click();

    // Waits for input controls to appear
    await page.waitForSelector('#email', {
      timeout: 500,
    });

    // Clears and fills "email" and "password" controls with wrong credentials
    await clearAndSetCredentials(email, `ZXC${password}987`);

    // Clicks login button 
    await page.click("form button.ant-btn-primary");

    // Checks for "Failed login" message
    await page.waitForSelector('div.ant-message-error>span:nth-child(2)');
    expect(await page.$eval('div.ant-message-error>span:nth-child(2)', el => el.textContent)).toMatch(LOGIN_FAILED_MSG);

    // Waits for error message and notification area to close 
    await page.waitForFunction(() => 
      document.querySelector('div.ant-message-error>span:nth-child(2)') === null &&
      document.querySelector('.ant-notification-notice-error') === null
    );

    // User should remains in the login page
    expect(page.url()).toMatch(`${BASE_URL}${LOGIN_PAGE}`);
  });

  it(`check for correct login`, async () => {
    // Clears and fills "email" and "password" controls with valid credentials
    await clearAndSetCredentials(email, password);
    await page.screenshot({path: `${SCREENSHOTS_PATH}/login_page_signin_fields.jpg`});

    // Click login button 
    await page.click("form button.ant-btn-primary");
    
    // Waits and check for navigation to the main page ...
    await page.waitForNavigation();
    expect(page.url()).toMatch(`${BASE_URL}${MAIN_PAGE}`);

    // ... and also checks for successful login message
    const successfulMessageSelector = '.ant-message > div > .ant-message-notice > .ant-message-notice-content';
    await page.waitForSelector(successfulMessageSelector);
    expect(await page.$eval(successfulMessageSelector, el => el.textContent)).toEqual(LOGIN_SUCCESSFUL_MSG);
  });

});