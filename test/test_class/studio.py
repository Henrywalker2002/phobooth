from base import BaseTestCase
import os 
import pandas as pd 
import traceback

class TestAddStudio(BaseTestCase):
    
    @classmethod 
    def load_data_xlsx(self, sheet_name, file_path = "./data.xlsx") -> list[dict]:
        df : pd.DataFrame = pd.read_excel(file_path, sheet_name = sheet_name)
        df.fillna('', inplace=True)
        df['phone'] = df['phone'].astype('str')
        df['phone'] = df['phone'].apply(lambda x: x if x and x.startswith('0') else '0' + x)
        df['phone'] = df['phone'].apply(lambda x: x if x != '0' else '')
        lst = []
        for index, row in df.iterrows():
            lst.append(row.to_dict())
        return lst
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.data = cls.load_data_xlsx(sheet_name='add_studio')
        cls.driver.maximize_window()
        cls.login_with_account('username123', 'password')
    
    def input_type(self, value):
        self.command.execute_click(target = "xpath=//input[@name='type']/../..")
        self.command.execute_pause(amount = 0.5)
        option = self.command.find_target(f"xpath=//li[contains(text(), '{value}')]")
        option.click()
    
    def input_data(self, data : dict):
        self.command.execute_open(target = f"{self.base_url}/studio/register")
        self.command.execute_assert_element_present(target='xpath=//input[@name="friendly_name"]')
        type_data = {
            "friendly_name": data.get('friendly_name'),
            "description": data.get('description'),
            "code_name" : data.get('code_name'),
            "email" : data.get('email'),
            "phone" : data.get('phone'),
            "street" : data.get('street'),
        }
        self.command.execute_input(type_data)
        self.input_selection('province', data.get('province'))
        self.input_selection('district', data.get('district'))
        self.input_selection('ward', data.get('ward'))
        self.input_type(data.get('type'))
        if data.get('avatar') != '': 
            url_avatar = os.path.join(os.getcwd(), 'assets', 'studio', data.get('avatar'))
            self.command.execute_upload_file(target="xpath=//*[@type='file']", value = url_avatar)
        self.command.execute_pause(amount = 2)
        self.command.execute_click(target = "xpath=//button[@type='submit']")
        self.command.execute_pause(amount = 1)
    
    def check_error(self, field, value):    
        if value == "required":
            if field == 'avatar': 
                self.command.execute_assert_message_error(target = "xpath=//input[@type='file']", value = "Please select a file.")
            else:
                self.command.execute_assert_message_error(target = f"xpath=//*[@name='{field}']", value = "Please fill out this field.")
        elif value == "invalid":
            if field == "email":
                element = self.command.find_target(f"xpath=//input[@name='email']")
                message_error = element.get_attribute('validationMessage')
                assert "email address" in message_error
            elif field == "phone":
                self.command.execute_assert_text(target="id=phone-helper-text", value="Số điện thoại phải bắt đầu bằng số 0 và chỉ chứa số.")
            elif field == "code_name":
                self.command.execute_assert_text(target="id=code_name-helper-text", value="Tên cửa hàng phải bắt đầu bằng chữ cái hoặc số và chỉ bao gồm chữ cái số, kí tự và dấu gạch dưới.")
        elif value == "duplicate":
            text = self.command.find_target(f"id={field}-helper-text").text
            assert "đã tồn tại" in text
    
    def test(self):
        for row in self.data:
            try :
                self.input_data(row)
                expect = row.get('expect')
                if expect == 'success':
                    self.command.execute_pause(amount = 3)
                    self.command.execute_assert_url(value = f'{self.base_url}/studio/')
                else:
                    field, value = expect.split(':')
                    self.check_error(field, value)
                row['result'] = 'pass'
                row['error'] = ''
            except Exception as e:
                row['result'] = 'fail'
                row['error'] = str(e)
                traceback.print_exc()

        self.write_data_xlsx(sheet_name='add_studio', data=self.data)