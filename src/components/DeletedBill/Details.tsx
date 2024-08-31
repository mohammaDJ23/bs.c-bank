import { Box, Typography, Button } from '@mui/material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { Bill, Pathes, deletedAtColor } from '../../lib';
import { ModalNames } from '../../store';
import { RestoreBillApi } from '../../apis';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface DetailsImporation {
  bill: Bill;
}

const Details: FC<DetailsImporation> = ({ bill }) => {
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const isResotreBillApiFailed = request.isProcessingApiFailed(RestoreBillApi);
  const isRestoreBillApiSuccessed = request.isProcessingApiSuccessed(RestoreBillApi);
  const isRestoreBillApiProcessing = request.isApiProcessing(RestoreBillApi);
  const restoreBillApiExceptionMessage = request.getExceptionMessage(RestoreBillApi);

  const showRestoreBillModal = useCallback(() => {
    actions.showModal(ModalNames.RESTORE_BILL);
  }, []);

  const hideRestoreBillModal = useCallback(() => {
    actions.hideModal(ModalNames.RESTORE_BILL);
  }, []);

  const restoreBill = useCallback(() => {
    actions.restoreBill(bill.id);
  }, [bill]);

  useEffect(() => {
    if (isRestoreBillApiSuccessed) {
      hideRestoreBillModal();
      navigate(Pathes.BILLS);
    } else if (isResotreBillApiFailed) {
      snackbar.enqueueSnackbar({ message: restoreBillApiExceptionMessage, variant: 'error' });
    }
  }, [isResotreBillApiFailed, isRestoreBillApiSuccessed]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px" overflow="hidden">
        <Box overflow="hidden" mb="15px" width="100%">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              }}
              width="100%"
              display="flex"
              gap="8px"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
                {bill.amount}
              </Typography>
            </Box>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.02s',
              }}
              component={'p'}
              fontSize="12px"
              color={`${bill.receiver.deletedAt ? deletedAtColor() : 'rgba(0, 0, 0, 0.6)'}`}
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Receiver:
              </Typography>{' '}
              {bill.receiver.name}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.04s',
              }}
              component={'p'}
              fontSize="12px"
              color={`${bill.location.deletedAt ? deletedAtColor() : 'rgba(0, 0, 0, 0.6)'}`}
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Location:
              </Typography>{' '}
              {bill.location.name}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              component={'p'}
              sx={{
                fontSize: '12px',
                color: 'rgba(0, 0, 0, 0.6)',

                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.06s',
              }}
            >
              <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                Consumers:{' '}
              </Typography>
              {bill.consumers.map((consumer) => (
                <Box
                  key={consumer.id}
                  component={'span'}
                  sx={{
                    backgroundColor: '#e6e6e6',
                    borderRadius: '20px',
                    padding: '1px 10px',
                    minWidth: '50px',
                    display: 'inline-block',
                    textAlign: 'center',
                    margin: '1px',
                  }}
                >
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '12px',
                      textAlign: 'center',
                      color: `${consumer.deletedAt ? deletedAtColor() : 'rgba(0, 0, 0, 0.6)'}`,
                    }}
                  >
                    {consumer.name}
                  </Typography>
                </Box>
              ))}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.08s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Description:
              </Typography>{' '}
              {bill.description}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.1s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Received at:
              </Typography>{' '}
              {bill.date ? moment(bill.date).format('LL') : '_'}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.12s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Created at:
              </Typography>{' '}
              {moment(bill.createdAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.14s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Deleted at:
              </Typography>{' '}
              {moment(bill.deletedAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.16s',
              }}
              mt="30px"
            >
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
          </ResetStyleWithAnimation>
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
