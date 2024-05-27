from base import BaseTestCase
from selenium.webdriver.common.by import By
from command import CommandChoices


class TestSignIn(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.data = cls.load_data_xlsx(sheet_name='sign_in')
    
    def input_data(self, data):
        username = data.get('username')
        password = data.get('password')
        self.command.execute(CommandChoices.OPEN, target = self.login_url)
        self.command.execute(CommandChoices.TYPE, target = "id=standard-basic", value = username)
        self.command.execute(CommandChoices.TYPE, target = "id=standard-adornment-password", value = password)
        self.command.execute(CommandChoices.CLICK, target = "xpath=//button[@type='submit']")
        self.command.execute_pause(amount = 2)
        
    def check_error(self, field, value):
        if value == 'required':
            if field == 'username':
                self.command.execute_assert_message_error(target = "id=standard-basic", value = "Please fill out this field.")
            else:
                self.command.execute_assert_message_error(target = "id=standard-adornment-password", value = "Please fill out this field.")
        elif value == "wrong":
            self.command.execute_wait_for_element_present(target="xpath=//*[contains(text(), 'Sai tên đăng nhập hoặc mật khẩu')]")
        elif value == "ban":
            self.command.execute_wait_for_element_present(target="xpath=//*[contains(text(), 'Tài khoản của bạn đã bị khoá')]")

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
        self.write_data_xlsx(sheet_name='sign_in', data=self.data)