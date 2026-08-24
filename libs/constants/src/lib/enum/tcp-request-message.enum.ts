enum INVOICE {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
  SEND = 'invoice.send',
  UPDATE_INVOICE_PAID = 'invoice.update_invoice_paid',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
};
