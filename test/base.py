from typing import Optional
from selenium.webdriver.edge.webdriver import WebDriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
import unittest
import time 
import json 
import pandas as pd 
from command import Command, CommandChoices
import os 


class BaseTestCase(unittest.TestCase):
    
    driver: Optional[WebDriver] = None 
    command : Optional[Command] = None
    login_url = "http://localhost:5173/login/"
    redirect_url = "http://localhost:5173/"
    base_url = "http://localhost:5173"
    data : list[dict] = []
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()    
        options = Options()
        service = Service(executable_path='./msedgedriver.exe')
        cls.driver = WebDriver(service=service, options=options)
        cls.command = Command(cls.driver)
    
    @classmethod
    def wait_until_url_is(self, url, timeout=30):
        start_time = time.time()
        while self.driver.current_url != url:
            if time.time() - start_time > timeout:
                raise Exception(f'Timed out waiting for URL to be {url}')
            time.sleep(0.5)
    
    @classmethod
    def login(self):
        self.driver.get(self.login_url)
        self.wait_until_url_is(self.redirect_url)
        cookies = self.driver.get_cookies()
        with open('cookies.json', 'w') as f:
            json.dump(cookies, f)
        if isinstance(cookies, list):
            for cookie in cookies:
                self.driver.add_cookie(cookie)
    
    @classmethod
    def login_with_account(self, username, password):
        self.command.execute(CommandChoices.OPEN, target = self.login_url)
        self.command.execute(CommandChoices.TYPE, target = "id=standard-basic", value = username)
        self.command.execute(CommandChoices.TYPE, target = "id=standard-adornment-password", value = password)
        self.command.execute(CommandChoices.CLICK, target = "xpath=//button[@type='submit']")
        self.wait_until_url_is(self.redirect_url)
        cookies = self.driver.get_cookies()
        with open('cookies.json', 'w') as f:
            json.dump(cookies, f)
        if isinstance(cookies, list):
            for cookie in cookies:
                self.driver.add_cookie(cookie)
    
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.driver.quit()
    
    @classmethod 
    def load_data_xlsx(self, sheet_name, file_path = "./data.xlsx") -> list[dict]:
        df : pd.DataFrame = pd.read_excel(file_path, sheet_name = sheet_name)
        df.fillna('', inplace=True)
        lst = []
        for index, row in df.iterrows():
            lst.append(row.to_dict())
        return lst

    @classmethod
    def write_data_xlsx(self, sheet_name, data, file_path = "./data.xlsx"):
        df : pd.DataFrame = pd.DataFrame(data)
        df.to_excel(file_path, sheet_name=sheet_name, engine='openpyxl', index=False)
        
    def handle_send_file(self, file_str):
        file_name_lst = file_str.split(';')
        value_lst = []
        for file_name in file_name_lst:
            value_lst.append(f"{os.getcwd()}\\assets\\add_item\\{file_name}")
        self.command.execute_upload_file(target = "xpath=//input[@type='file']", 
                                         value = "\n".join(value_lst))