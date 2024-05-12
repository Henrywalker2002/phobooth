import time
from selenium.webdriver.edge.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote import webelement
from selenium.webdriver.support.ui import Select
from exceptions import *
from keys import KeyChoices
import json


class CommandChoices:
    OPEN = 'open'
    TYPE = 'type'
    PRESS_KEY = 'press_key'
    INPUT = 'input'
    SELECT_OPTION = "select_option"
    UPLOAD_FILE = "upload_file"
    CLICK = 'click'
    ClOSE = 'close'
    ASSERT = 'assert'
    ASSERT_ELEMENT_PRESENT = 'assert_element_present'
    ASSERT_ELEMENT_NOT_PRESENT = 'assert_element_not_present'
    ASSERT_URL = 'assert_url'
    ASSERT_TEXT = 'assert_text'
    ASSERT_TITLE = 'assert_title'
    CHECK = 'check'
    UNCHECK = 'uncheck'
    EDIT_CONTENT = 'edit_content'
    PAUSE = 'pause'
    WAIT_FOR_ELEMENT_PRESENT = 'wait_for_element_present'
    WAIT_FOR_ELEMENT_NOT_PRESENT = 'wait_for_element_not_present'
    WAIT_FOR_ELEMENT_VISIBLE = 'wait_for_element_visible'
    WAIT_FOR_ELEMENT_NOT_VISIBLE = 'wait_for_element_not_visible'
    WAIT_FOR_ELEEENT_CLICKABLE = 'wait_for_element_clickable'
    SCROLL_TO = 'scroll_to'
    INPUT_DATE = 'input_date'
    ASSERT_MESSAGE_ERROR = 'get_message_error'

    validate_settings = {
        OPEN: ['target'],
        TYPE: ['target', 'value'],
        PRESS_KEY: ['target', 'value'],
        INPUT: ['value'],
        SELECT_OPTION: ['target', 'value'],
        UPLOAD_FILE : ['target', 'value'],
        CLICK: ['target'],
        ASSERT: ['target', 'value'],
        ASSERT_ELEMENT_NOT_PRESENT: ['target'],
        ASSERT_ELEMENT_PRESENT: ['target'],
        ASSERT_URL: ['value'],
        ASSERT_TEXT: ['target', 'value'],
        ASSERT_TITLE: ['value'],
        CHECK: ['target'],
        UNCHECK: ['target'],
        EDIT_CONTENT: ['target', 'value'],
        PAUSE: ['amount'],
        WAIT_FOR_ELEMENT_PRESENT: ['target', 'amount'],
        WAIT_FOR_ELEMENT_NOT_PRESENT: ['target', 'amount'],
        WAIT_FOR_ELEMENT_VISIBLE: ['target', 'amount'],
        WAIT_FOR_ELEMENT_NOT_VISIBLE: ['target', 'amount'],
        WAIT_FOR_ELEEENT_CLICKABLE: ['target', 'amount'],
        SCROLL_TO: ['target'],
        INPUT_DATE: ['target', 'value'],
        ASSERT_MESSAGE_ERROR: ['target', 'value']
    }

    @staticmethod
    def get_all():
        return list(filter(lambda attr: attr == attr.upper() and not callable(getattr(CommandChoices, attr)), dir(CommandChoices)))

    @staticmethod
    def get_all_value():
        available = CommandChoices.get_all()
        return list(map(lambda attr: getattr(CommandChoices, attr), available))


class Command:
    def __init__(self, driver: WebDriver) -> None:
        self.driver = driver

    def validate(self, command, *args, **kwargs) -> None:
        settings = CommandChoices.validate_settings.get(command)
        for setting in settings:
            if setting not in kwargs:
                raise ValueError(f'Missing required parameter: {setting}')

    def execute(self, command, *args, **kwargs) -> None:
        store = {}
        if command in CommandChoices.get_all_value():
            attr = self.__getattribute__(f'execute_{command}')
            self.validate(command, *args, **kwargs)
            kwargs['store'] = store
            store = attr(*args, **kwargs)
        else:
            raise InvalidCommandException(command)

    def get_present(self, target) -> EC.presence_of_element_located:
        type, target = target[0:target.index(
            '=')], target[target.index('=') + 1:]
        if type == 'xpath':
            return EC.presence_of_element_located((By.XPATH, target))
        elif type == 'id':
            return EC.presence_of_element_located((By.ID, target))
        elif type == 'css':
            return EC.presence_of_element_located((By.CSS_SELECTOR, target))
        else:
            raise InvalidTargetException(target)

    def get_located(self, target) -> EC.visibility_of_element_located:
        type, target = target[0:target.index(
            '=')], target[target.index('=') + 1:]
        if type == 'xpath':
            return EC.visibility_of_element_located((By.XPATH, target))
        elif type == 'id':
            return EC.visibility_of_element_located((By.ID, target))
        elif type == 'css':
            return EC.visibility_of_element_located((By.CSS_SELECTOR, target))
        else:
            raise InvalidTargetException(target)

    def find_target(self, target: str) -> webelement.WebElement:
        type, target = target[0:target.index(
            '=')], target[target.index('=') + 1:]
        element = None

        if type == 'xpath':
            element = self.driver.find_element(By.XPATH, target)
        elif type == 'id':
            element = self.driver.find_element(By.ID, target)
        elif type == 'css':
            element = self.driver.find_element(By.CSS_SELECTOR, target)
        else:
            raise InvalidTargetException(target)

        return element

    def execute_open(self, *args, **kwargs) -> dict:
        url = kwargs.get('target')
        self.driver.get(url)
        return kwargs.get('store')

    def execute_type(self, *args, **kwargs) -> dict:
        target = kwargs.get('target')
        value = kwargs.get('value')
        element = self.find_target(target)
        element.send_keys(value)
        return kwargs.get('store')
    
    def execute_press_key(self, target, value, *args, **kwargs) -> dict:
        element = self.find_target(target)
        if value not in KeyChoices.get_all():
            raise InvalidKeyChoicesException(value)
        element.send_keys(KeyChoices.get_key(value))
        return kwargs.get('store')

    def execute_input(self,value : dict, *args, **kwargs) -> dict:
        """
        value is a dict which key is name of input field and value is the value to be inputted
        """
        if not isinstance(value, dict):
            value = json.loads(value)
        for key, val in value.items():
            key = f"xpath=//*[@name='{key}']"
            element = self.find_target(key)
            element.send_keys(val)
        return kwargs.get('store')

    def execute_select_option(self, target, value, *args, **kwargs):
        element = self.find_target(target)
        select = Select(element)
        type, value = value[0:value.index('=')], value[value.index('=') + 1:]
        if type == 'text':
            select.select_by_visible_text(value)
        elif type == 'value':
            select.select_by_value(value)
        elif type == 'index':
            select.select_by_index(value)
        else:
            raise InvalidKeyChoicesException(value)
        return kwargs.get('store')

    def execute_upload_file(self, target, value, *args, **kwargs):
        element = self.find_target(target)
        element.send_keys(value)
        return kwargs.get('store')
    
    def execute_click(self, *args, **kwargs) -> dict:
        target = kwargs.get('target')
        element = self.find_target(target)
        element.click()
        return kwargs.get('store')

    def execute_close(self, *args, **kwargs) -> dict:
        self.driver.quit()
        return kwargs.get('store')

    def execute_assert(self, target, value, *args, **kwargs) -> dict:
        element = self.find_target(target)
        if element.text != value:
            raise AssertException(CommandChoices.ASSERT, target, value)
        return kwargs.get('store')

    def execute_assert_element_present(self, target, *args, **kwargs) -> dict:
        try:
            self.find_target(target)
        except NoSuchElementException:
            raise AssertException(
                CommandChoices.ASSERT_ELEMENT_PRESENT, target, 'present')
        return kwargs.get('store')

    def execute_assert_element_not_present(self, target, *args, **kwargs) -> dict:
        try:
            self.find_target(target)
        except NoSuchElementException:
            return kwargs.get('store')
        raise AssertException(
            CommandChoices.ASSERT_ELEMENT_NOT_PRESENT, target)

    def execute_assert_url(self, value, *args, **kwargs) -> dict:
        if self.driver.current_url != value:
            raise AssertException(CommandChoices.ASSERT_URL, 'url', value)
        return kwargs.get('store')

    def execute_assert_text(self, target, value, *args, **kwargs) -> dict:
        if self.find_target(target).text != str(value):
            raise AssertException(CommandChoices.ASSERT_TEXT, target, value)
        return kwargs.get('store')

    def execute_assert_title(self, value, *args, **kwargs) -> dict:
        if self.driver.title != value:
            raise AssertException(CommandChoices.ASSERT_TITLE, "title", value)
        return kwargs.get('store')

    def execute_check(self, target, *args, **kwargs) -> dict:
        if not self.find_target(target).is_selected():
            self.find_target(target).click()
        return kwargs.get('store')

    def execute_uncheck(self, target, *args, **kwargs) -> dict:
        if self.find_target(target).is_selected():
            self.find_target(target).click()
        return kwargs.get('store')

    def execute_edit_content(self, target, value, *args, **kwargs) -> dict:
        element = self.find_target(target)
        element.clear()
        element.send_keys(value)
        return kwargs.get('store')

    def execute_pause(self, amount = 5, *args, **kwargs) -> dict:
        time.sleep(amount)
        return kwargs.get('store')

    def execute_wait_for_element_present(self, target, amount = 5, *args, **kwargs) -> dict:
        present = self.get_present(target)
        WebDriverWait(self.driver, amount).until(present)
        return kwargs.get('store')

    def execute_wait_for_element_not_present(self, target, amount = 5, *args, **kwargs) -> dict:
        present = self.get_present(target)
        WebDriverWait(self.driver, amount).until_not(present)
        return kwargs.get('store')

    def execute_wait_for_element_visible(self, target, amount = 5, *args, **kwargs) -> dict:
        located = self.get_located(target)
        WebDriverWait(self.driver, amount).until(located)
        return kwargs.get('store')

    def execute_wait_for_element_not_visible(self, target, amount = 5, *args, **kwargs) -> dict:
        located = self.get_located(target)
        WebDriverWait(self.driver, amount).until_not(located)
        return kwargs.get('store')
    
    def execute_wait_for_element_clickable(self, target, amount = 5, *args, **kwargs) -> dict:
        element = self.find_target(target)
        WebDriverWait(self.driver, amount).until(EC.element_to_be_clickable(element))
        return kwargs.get('store')
    
    def execute_scroll_to(self, target, *args, **kwargs) -> dict:
        element = self.find_target(target)
        self.driver.execute_script("arguments[0].scrollIntoView();", element)
        return kwargs.get('store')

    def execute_input_date(self, target, value, *args, **kwargs) -> dict:
        element = self.find_target(target)
        ActionChains(self.driver).move_to_element(element).click().send_keys(value).perform()
        return kwargs.get('store')
    
    def execute_assert_message_error(self, target, value, *args, **kwargs) -> dict:
        element = self.find_target(target)
        if element.get_attribute("validationMessage") != value:
            raise AssertException(CommandChoices.ASSERT_MESSAGE_ERROR, target, value)
        return kwargs.get('store')