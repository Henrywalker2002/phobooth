from base import BaseTestCase
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


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


class TestAddOrderItem(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.driver.maximize_window()
        cls.login_with_account('first user', 'password')
        cls.data = cls.load_data_xlsx(sheet_name='add_order_item')
    
    def handle_choose_type(self, type):
        self.command.execute_click(target = "xpath=/html/body/div[2]/div[3]/div/div/div[1]/div[1]")
        self.command.execute_click(target = f"xpath=//li[text()='{type}']")
    
    def input_data(self, data : dict):
        self.command.execute_pause(amount = 2)
        self.command.execute_click(target = "xpath=//button[text()='Thêm sản phẩm']")
        self.command.execute_wait_for_element_visible(target = "xpath=//div[@role='dialog']", amount=5)
        self.handle_choose_type(data.get('type'))
        self.command.execute_check(target = f"xpath=//*[@id='{data.get('item')}']//input")
        self.command.execute_click(target = "xpath=//button[text()='Lưu thay đổi']")
        self.command.execute_edit_content(target= "xpath=//tr/td[4]//input", value= data.get('price'))
        self.command.execute_edit_content(target= "xpath=//tr/td[5]//input", value= data.get('quantity'))
        self.command.execute_click(target = "xpath=//div[@role='dialog']//button[text()='Thêm sản phẩm']")
        self.command.execute_assert_element_present(target = f"id={data.get('item')}")
    
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
                        pass 
                    else:
                        field, value = expect.split(':')
                        self.check_error(field, value)
                    row['result'] = 'pass'
                    row['error'] = ''
                except Exception as e:
                    row['result'] = 'fail'
                    row['error'] = str(e)
                    print(e)
            self.write_data_xlsx(sheet_name='add_order_item', data=self.data)
            

class TestAddPayment(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.driver.maximize_window()
        cls.login_with_account('first user', 'password')
        cls.data = cls.load_data_xlsx(sheet_name='add_payment')
    
    def input_data(self, data: dict):
        self.command.execute_wait_for_element_present(target="xpath=//button[text()='Tạo yêu cầu']", amount = 5)
        self.command.execute_scroll_to(target="xpath=//button[text()='Tạo yêu cầu']")
        self.command.execute_pause(amount = 1)
        self.command.execute_click(target="xpath=//button[text()='Tạo yêu cầu']")
        self.command.execute_wait_for_element_visible(target="xpath=//div[@role='dialog']", amount = 5)
        expire_date = data.get('expiration_date').replace('-', "")
        self.command.execute_input_date(target = "xpath=//input[@name='expiration_date']", value = expire_date)
        self.command.execute_type(target = "id=outlined-basic", value = data.get('amount'))
        self.command.execute_pause(amount= 1)
        self.command.execute_click(target = "xpath=//*[@role='dialog']//button[text()='Tạo yêu cầu']")
        self.command.execute_wait_for_element_not_present(target="xpath=//div[@role='dialog']", amount = 5)
    
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
                        pass 
                    else:
                        field, value = expect.split(':')
                        self.check_error(field, value)
                    row['result'] = 'pass'
                    row['error'] = ''
                except Exception as e:
                    row['result'] = 'fail'
                    row['error'] = str(e)
                    print(e)
            self.write_data_xlsx(sheet_name='add_payment', data=self.data)
        