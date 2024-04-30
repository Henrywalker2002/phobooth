from base import BaseTestCase


class TestCreateOrder(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.login_with_account('henrywalker', 'string123')
        cls.data = cls.load_data_xlsx(sheet_name='create_order')
    
    def handle_add_to_cart(self, item_lst):
        for item_id in item_lst:
            self.command.execute_open(target = f"{self.base_url}/item/detail/{item_id}")
            self.command.execute_click(target = "xpath=//button[text()='Thêm vào giỏ hàng']")
    
    def input_data(self, data: dict):
        item_lst: list = data.get('item').split(';')
        self.handle_add_to_cart(item_lst)
        self.command.execute_open(target = f"{self.base_url}/cart")
        if item_lst:
            self.command.execute_wait_for_element_present(target= f"xpath=//*[@id='{item_lst[0]}']//input", amount=10)
        for item_id in item_lst:
            self.command.execute_check(target=f"xpath=//*[@id='{item_id}']//input")
        self.command.execute_click(target = "xpath=//button[text()='Đặt dịch vụ']")
        if data.get('address'):
            pass 
        self.command.execute_click(target = "xpath=//button[text()='Đặt dịch vụ']")
        self.command.execute_pause(amount = 3)
    
    def check_error(self, field, value):
        pass 
    
    def test(self):
        for row in self.data:
            try:
                self.input_data(row)
                expect = row.get('expect')
                if expect == 'success':
                    self.command.execute_assert_url(value = f'{self.base_url}/orders')
                else:
                    field, value = expect.split(':')
                    self.check_error(field, value)
                row['result'] = 'pass'
                row['error'] = ''
            except Exception as e:
                row['result'] = 'fail'
                row['error'] = str(e)
                print(e)
        self.write_data_xlsx(sheet_name='create_order', data=self.data)