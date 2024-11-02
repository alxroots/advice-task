from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import pytest
import time

@pytest.fixture(scope="module")
def driver():
    driver = webdriver.Chrome()
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


def test_login(driver):
    driver.get("http://localhost:5173/login/")

    username_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Your username']")
    username_input.send_keys("goku")

    password_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Your password']")
    password_input.send_keys("123456")

    password_input.send_keys(Keys.RETURN)

    time.sleep(2)
    assert "/tasks" in driver.current_url

def test_register(driver):
    test_username = "newuser"
    driver.get("http://localhost:5173/register/")

    username_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Your username']")
    username_input.send_keys(test_username)

    password_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Your password']")
    password_input.send_keys("password123")

    confirm_password_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Confirm your password']")
    confirm_password_input.send_keys("password123")

    confirm_password_input.send_keys(Keys.RETURN)

    try:
        WebDriverWait(driver, 10).until(EC.url_contains("/tasks"))
        assert "/tasks" in driver.current_url
    except:
        print('Falha ao registrar o usuário.')