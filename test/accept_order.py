from base import BaseTestCase
from selenium.webdriver.common.by import By

class TestAcceptOrder(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.driver.maximize_window()
        cls.login_with_account('first user', 'password')
        cls.data = cls.load_data_xlsx(sheet_name='accept_order')
    
    def input_data(self, data: dict):
        self.command.execute_wait_for_element_present(target= f"xpath=//*[@id='{data.get('item')}']//button", amount = 5)
        self.command.execute_pause(amount = 2)
        self.command.execute_click(target = f"xpath=//*[@id='{data.get('item')}']//button")
        self.command.execute_wait_for_element_present(target= "xpath=//*[@role='dialog']", amount=5)
        self.command.execute_edit_content(target = "id=outlined-basic", value = data.get('price'))
        while int(self.driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/div/div/div[4]/div[2]/div[2]").text) != data.get('quantity'):
            self.command.execute_click(target = "xpath=/html/body/div[2]/div[3]/div/div/div[4]/div[2]/div[3]/button")
        self.command.execute_click(target = "xpath=//button[text()='Lưu thay đổi']")
        self.command.execute_wait_for_element_not_present(target= "xpath=//*[@role='dialog']", amount=5)
        self.command.execute_assert_text(target = f"xpath=//*[@id='{data.get('item')}']/td[4]", value = data.get('quantity'))
        # not handle yet
        # self.command.execute_assert_text(target = f"xpath=//*[@id='{data.get('item')}']/td[5]", value = data.get('price'))
        self.command.execute_click(target = 'id=outlined-status')
        self.command.execute_click(target = "xpath=//li[@data-value='IN_PROCESS']")
    
    def check_error(self, field, value):
        pass
    
    def test(self):
        if self.data:
            order_id = self.data[0].get('order')
            self.command.execute_open(target = f"{self.base_url}/studio/order/detail/{order_id}")
            for row in self.data:
                try:
                    self.input_data(row)
                    expect = row.get('expect')
                    if expect == 'success':
                        self.command.execute_wait_for_element_visible(target = "xpath=//*[text()='Cập nhật trạng thái thành công !']", amount=5)
                    else:
                        field, value = expect.split(':')
                        self.check_error(field, value)
                    row['result'] = 'pass'
                    row['error'] = ''
                except Exception as e:
                    row['result'] = 'fail'
                    row['error'] = str(e)
                    print(e)
            self.write_data_xlsx(sheet_name='accept_order', data=self.data)