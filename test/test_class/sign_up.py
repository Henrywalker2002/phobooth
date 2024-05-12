from base import BaseTestCase
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement

class TestSignUp(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.data = cls.load_data_xlsx(sheet_name='sign_up')
    
    def input_data(self, data):
        self.command.execute_open(target = f"{self.base_url}/signup")
        self.command.execute_wait_for_element_present(target='id=fullname', amount=10)
        self.command.execute_type(target = "id=fullname", value = data.get('fullname'))
        self.command.execute_type(target = "id=username", value = data.get('username'))
        self.command.execute_type(target = "xpath=//input[@type='email']", value = data.get('email'))
        self.command.execute_type(target = "xpath=//input[@type='password']", value = data.get('password'))
        self.command.execute_pause(amount = 2)
        self.command.execute_click(target = "xpath=//button[@type='submit']")
        self.command.execute_pause(amount = 2)
    
    def check_error(self, field, value):
        if field not in ['fullname', 'username', 'email', 'password']:
            assert False
        if value == 'required':
            self.command.execute_assert_message_error(target = f"xpath=//input[@name='{field}']", value = "Please fill out this field.")
        elif value == 'invalid':
            element = self.command.find_target(f"xpath=//input[@name='{field}']")
            message_error = element.get_attribute('validationMessage')
            assert "email address" in message_error
        else:
            target_id = f"{field}-helper-text"
            self.command.execute_assert_text(target = f"id={target_id}", value = value)
    
    def test(self):
        for row in self.data:
            try :
                self.input_data(row)
                expect = row.get('expect')
                if expect == 'success':
                    self.command.execute_pause(amount = 3)
                    self.command.execute_assert_url(value = f'{self.base_url}/')
                else:
                    field, value = expect.split(':')
                    self.check_error(field, value)
                row['result'] = 'pass'
                row['error'] = ''
            except Exception as e:
                row['result'] = 'fail'
                row['error'] = str(e)
                print(e)
        self.write_data_xlsx(sheet_name='sign_up', data=self.data)
    