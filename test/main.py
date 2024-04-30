import unittest
from sign_up import TestSignUp
from add_item import TestAddService
from order import * 


if __name__ == "__main__":
    suite = unittest.TestSuite()
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestSignUp))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddService))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestCreateOrder))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAcceptOrder))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddOrderItem))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddPayment))
    unittest.TextTestRunner(verbosity=2).run(suite)
    