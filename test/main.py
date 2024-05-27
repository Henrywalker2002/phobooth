import unittest
from test_class.sign_up import TestSignUp
from test_class.sign_in import TestSignIn 
from test_class.add_item import TestAddService
from test_class.order import * 
from test_class.studio import TestAddStudio
import argparse
import subprocess
import time 


def run_all(suite: unittest.TestSuite):
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestSignUp))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddStudio))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddService))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestCreateOrder))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAcceptOrder))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddOrderItem))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddPayment))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestPayment))
    suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestCompleteOrder))
    return suite


def main():
    parser = argparse.ArgumentParser()
    suite = unittest.TestSuite()
    parser.add_argument("test", help="Run test",)
    parser.add_argument("--test_sign_up", help="Run test sign up", action='store_true')
    parser.add_argument("--test_add_studio", help="Run test add studio", action='store_true')
    parser.add_argument("--test_add_item", help="Run test add item", action='store_true')
    parser.add_argument("--test_create_order", help="Run test create order", action='store_true')
    parser.add_argument("--test_accept_order", help="Run test accept order",action='store_true')
    parser.add_argument("--test_add_order_item", help="Run test add order item", action='store_true')
    parser.add_argument("--test_add_payment", help="Run test add payment", action='store_true')
    parser.add_argument("--test_payment", help="Run test payment", action='store_true')
    parser.add_argument("--test_complete_order", help="Run test complete order", action='store_true')
    parser.add_argument("--test_sign_in", help="Run test sign in", action='store_true')
    args = parser.parse_args()
    
    if args.test_sign_up:
        subprocess.run(["load_db.bat", "test_db"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestSignUp))
    elif args.test_add_studio:
        subprocess.run(["load_db.bat", "add_user"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddStudio))
    elif args.test_sign_in:
        subprocess.run(["load_db.bat", "add_user"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestSignIn))
    elif args.test_add_item:
        subprocess.run(["load_db.bat", "add_studio"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddService))
    elif args.test_create_order:
        subprocess.run(["load_db.bat", "add_service"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestCreateOrder))
    elif args.test_accept_order:
        subprocess.run(["load_db.bat", "add_order"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAcceptOrder))
    elif args.test_add_order_item:
        subprocess.run(["load_db.bat", "accept_order"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddOrderItem))
    elif args.test_add_payment:
        subprocess.run(["load_db.bat", "add_order_item"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestAddPayment))
    elif args.test_payment:
        subprocess.run(["load_db.bat", "add_payment"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestPayment))
    elif args.test_complete_order:
        subprocess.run(["load_db.bat", "payment"])
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestCompleteOrder))
    else:
        subprocess.run(["load_db.bat", "test_db"])
        suite = run_all(suite)
        
    subprocess.Popen(["run_all.bat"])
    time.sleep(3)
    unittest.TextTestRunner(verbosity=2).run(suite)
        
    
if __name__ == "__main__":
    main()
    