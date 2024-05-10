from base import BaseTestCase


class BaseTestItem(BaseTestCase):
    
    def handle_choose_category(self, category):
        self.command.execute_click(target = "id=outlined-select-categories")
        self.command.execute_wait_for_element_present(target = f"xpath=//li[text()='{category}']")
        self.command.execute_click(target = f"xpath=//li[text()='{category}']")


class TestAddService(BaseTestItem):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.login_with_account('username123', 'password')
        cls.data = cls.load_data_xlsx(sheet_name='add_service')
    
    def input_data(self, data: dict):
        self.command.execute_open(target = f"{self.base_url}/studio/items/add")
        self.driver.refresh()
        self.command.execute_wait_for_element_present(target="xpath=//input[@name='name']", amount=10)
        input_data = {
            'name': data.get('name'),
            'min_price': data.get('min_price'),
            'max_price': data.get('max_price'),
            'description': data.get('description')
        }
        self.command.execute_input(value=input_data)
        self.handle_send_file(data.get('image'))
        if data.get('category') != '':
            self.handle_choose_category(data.get('category'))
        self.command.execute_click(target = f"xpath=//span[text()='{data.get('type')}']")
        self.command.execute_pause(amount = 1)
        self.command.execute_click(target = "xpath=//button[@type='submit']")
    
    def check_error(self, field, value):
        if value == "required":
            if field != 'image':
                self.command.execute_assert_message_error(target = f"xpath=//*[@name='{field}']", value = "Please fill out this field.")
            else:
                self.command.execute_assert_element_present(target = "xpath=//div[@role='presentation']")
        elif value == "invalid":
            if field in ['min_price', 'max_price']:
                self.command.execute_assert_element_present(target = f"id={field}-helper-text")
                self.command.execute_assert_text(target = f"id={field}-helper-text", value = "Giá trị không hợp lệ!")
        else:
            assert False
        
    def test(self):
        for row in self.data:
            try:
                self.input_data(row)
                expect = row.get('expect')
                if expect == 'success':
                    self.command.execute_pause(amount = 3)
                    self.command.execute_assert_element_present(target = "xpath=//div[text()='Thêm sản phẩm thành công !']")
                else:
                    field, value = expect.split(':')
                    self.check_error(field, value)
                row['result'] = 'pass'
                row['error'] = ''
            except Exception as e:
                row['result'] = 'fail'
                row['error'] = str(e)
                print(e)
        self.write_data_xlsx(sheet_name='add_service', data=self.data)
    