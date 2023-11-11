import { Box, Typography, Button } from '@mui/material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { BillObj, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { RestoreBillApi } from '../../apis';

interface DetailsImporation {
  bill: BillObj;
}

const Details: FC<DetailsImporation> = ({ bill }) => {
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();

  const isRestoreBillApiProcessing = request.isApiProcessing(RestoreBillApi);

  const showRestoreBillModal = useCallback(() => {
    actions.showModal(ModalNames.RESTORE_BILL);
  }, []);

  const hideRestoreBillModal = useCallback(() => {
    actions.hideModal(ModalNames.RESTORE_BILL);
  }, []);

  const restoreBill = useCallback(() => {
    request.build(new RestoreBillApi(bill.id)).then((response) => {
      navigate(Pathes.BILLS);
    });
  }, [bill]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
            {bill.amount}
          </Typography>
        </Box>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Receiver:
          </Typography>{' '}
          {bill.receiver}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Description:
          </Typography>{' '}
          {bill.description}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Received at:
          </Typography>{' '}
          {moment(bill.date).format('LL')}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(bill.createdAt).format('LLLL')}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Deleted at:
          </Typography>{' '}
          {moment(bill.deletedAt).format('LLLL')}
        </Typography>
        <Box mt="30px">
          <Button
            disabled={isRestoreBillApiProcessing}
            onClick={showRestoreBillModal}
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          >
            Restore the bill
          </Button>
        </Box>
      </Box>
      <Modal
        title="Restoring the bill"
        body="Are you sure to restore the bill?"
        isLoading={isRestoreBillApiProcessing}
        isActive={selectors.modals[ModalNames.RESTORE_BILL]}
        onCancel={hideRestoreBillModal}
        onConfirm={restoreBill}
      />
    </>
  );
};

export default Details;
