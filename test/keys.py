from selenium.webdriver.common.keys import Keys


class KeyChoices(Keys):

    def get_all():
        return list(filter(lambda attr: attr == attr.upper() and not callable(getattr(KeyChoices, attr)), dir(KeyChoices)))

    def get_all_value():
        available = KeyChoices.get_all()
        return list(map(lambda attr: getattr(KeyChoices, attr), available))

    def get_key(key: str):
        return getattr(KeyChoices, key)