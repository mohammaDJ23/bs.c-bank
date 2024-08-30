import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { Bill, deletedAtColor, getDynamicPath, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteBillApi } from '../../apis';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface DetailsImporation {
  bill: Bill;
}

const Details: FC<DetailsImporation> = ({ bill }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const isDeleteBillApiProcessing = request.isApiProcessing(DeleteBillApi);
  const isDeleteBillApiSuccessed = request.isProcessingApiSuccessed(DeleteBillApi);
  const isDeleteBillApiFailed = request.isProcessingApiFailed(DeleteBillApi);
  const deleteBillApiExceptionMessage = request.getExceptionMessage(DeleteBillApi);
  const options = [{ label: 'Update', path: getDynamicPath(Pathes.UPDATE_BILL, { id: bill.id }) }];

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(
    (option: (typeof options)[number]) => {
      return function () {
        onMenuClose();
        navigate(option.path);
      };
    },
    [onMenuClose, navigate]
  );

  const onDeleteBill = useCallback(() => {
    actions.showModal(ModalNames.CONFIRMATION);
  }, []);

  useEffect(() => {
    if (isDeleteBillApiSuccessed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      navigate(Pathes.BILLS);
    } else if (isDeleteBillApiFailed) {
      snackbar.enqueueSnackbar({ message: deleteBillApiExceptionMessage, variant: 'error' });
    }
  }, [isDeleteBillApiSuccessed, isDeleteBillApiFailed]);

  const deleteBill = useCallback(() => {
    actions.deleteBill(bill.id);
  }, [bill]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px" overflow="hidden">
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              width: '100%',
              mb: '15px',
              display: 'flex',
              gap: '8px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
              {bill.amount}
            </Typography>
            <IconButton onClick={onMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClick={onMenuClose}>
              {options.map((option) => (
                <MenuItem key={option.path} onClick={onMenuClick(option)}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </ResetStyleWithAnimation>
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Typography
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
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
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Typography
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
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
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Typography
            component={'p'}
            sx={{
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.6)',
              opacity: '0',
              transform: 'translateY(30px)',
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
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Typography
            component={'p'}
            fontSize="12px"
            color="rgba(0, 0, 0, 0.6)"
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.08s',
            }}
          >
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Description:
            </Typography>{' '}
            {bill.description}
          </Typography>
        </ResetStyleWithAnimation>
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Typography
            component={'p'}
            fontSize="12px"
            color="rgba(0, 0, 0, 0.6)"
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.1s',
            }}
          >
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Received at:
            </Typography>{' '}
            {bill.date ? moment(bill.date).format('LL') : '_'}
          </Typography>
        </ResetStyleWithAnimation>
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Typography
            component={'p'}
            fontSize="12px"
            color="rgba(0, 0, 0, 0.6)"
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.12s',
            }}
          >
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Created at:
            </Typography>{' '}
            {moment(bill.createdAt).format('LLLL')}
          </Typography>
        </ResetStyleWithAnimation>
        {new Date(bill.updatedAt) > new Date(bill.createdAt) && (
          <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
            <Typography
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
              sx={{
                opacity: '0',
                transform: 'translateY(30px)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.14s',
              }}
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Last update:
              </Typography>{' '}
              {moment(bill.updatedAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        )}
        <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateY(0)' }}>
          <Box
            mt="30px"
            sx={{
              opacity: '0',
              transform: 'translateY(30px)',
              transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              transitionDelay: '0.16s',
            }}
          >
            <Button
              disabled={isDeleteBillApiProcessing}
              onClick={onDeleteBill}
              variant="contained"
              color="error"
              size="small"
              sx={{ textTransform: 'capitalize' }}
            >
              Delete the bill
            </Button>
          </Box>
        </ResetStyleWithAnimation>
      </Box>
      <Modal
        title="Deleting the Bill"
        body="Are you sure do delete the bill?"
        isLoading={isDeleteBillApiProcessing}
        isActive={selectors.modals[ModalNames.CONFIRMATION]}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteBill()}
      />
    </>
  );
};

export default Details;
