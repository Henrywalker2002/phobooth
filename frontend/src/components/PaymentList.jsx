import React, { useState, useEffect } from 'react';
import { Typography, Button, List, ListItem, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import useAxiosPrivate from '../hooks/useAxiosPrivate';


function PaymentList({open, setOpen, order_id}) {
  const [selected, setSelected] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate.get(`/payment/?order=${order_id}`).then((res) => {
      setPayments(res.data.results);
    }).catch((err) => {
      console.log(err);
    });
  }, [order_id]);

  const handleClose = () => {
    setOpen(false);
    setSelected([]);
    setError(null);
  };

  const handleListItemClick = (value) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((id) => id !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const handleRefund = () => {
    // refund
    handleClose();
    if (selected.length === 0) {
      setError("Chọn ít nhất 1 hóa đơn để hoàn tiền");
      return;
    }
    axiosPrivate.post('payment/refund/', { 'ids': selected }).then((res) => {
      setPayments(res.data)
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Hoàn tiền</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {payments.map((payment) => (
            <ListItem key={payment.id}>
              <Checkbox
                checked={selected.includes(payment.id)}
                onClick={() => handleListItemClick(payment.id)}
                disabled = {payment.status !== "PAID" || payment.payment_method !== "VNPAY"}
              />
              <span>Số tiền:  {payment.amount}</span> 
              <span> - Trạng thái: {payment.status}</span>
              <span> - Phương thức : {payment.payment_method}</span>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleRefund} color="primary">
          Refund
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentList;