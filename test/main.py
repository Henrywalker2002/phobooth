import unittest
from sign_up import TestSignUp
from add_item import TestAddService


if __name__ == "__main__":
    suite = unittest.TestSuite()
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestSignUp))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddService))
    unittest.TextTestRunner(verbosity=2).run(suite)