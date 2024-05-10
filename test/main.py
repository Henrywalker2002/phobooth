import unittest
from test_class.sign_up import TestSignUp
from test_class.add_item import TestAddService
from test_class.order import * 
from test_class.studio import TestAddStudio


if __name__ == "__main__":
    suite = unittest.TestSuite()
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestSignUp))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddStudio))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddService))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestCreateOrder))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAcceptOrder))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddOrderItem))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddPayment))
    # suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestPayment))
    unittest.TextTestRunner(verbosity=2).run(suite)
    