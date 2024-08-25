import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { Bill, deletedAtColor, getDynamicPath, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteBillApi } from '../../apis';

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
  const isDeleteBillApiProcessing = request.isApiProcessing(DeleteBillApi);
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

  const deleteBill = useCallback(() => {
    request
      .build<Bill, string>(new DeleteBillApi(bill.id))
      .then(() => {
        actions.hideModal(ModalNames.CONFIRMATION);
        navigate(Pathes.BILLS);
      })
      .catch((err) => actions.hideModal(ModalNames.CONFIRMATION));
  }, [bill, request]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
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
        <Typography
          component={'p'}
          fontSize="12px"
          color={`${bill.receiver.deletedAt ? deletedAtColor() : 'rgba(0, 0, 0, 0.6)'}`}
        >
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Receiver:
          </Typography>{' '}
          {bill.receiver.name}
        </Typography>
        <Typography
          component={'p'}
          fontSize="12px"
          color={`${bill.location.deletedAt ? deletedAtColor() : 'rgba(0, 0, 0, 0.6)'}`}
        >
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Location:
          </Typography>{' '}
          {bill.location.name}
        </Typography>
        <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
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
          {bill.date ? moment(bill.date).format('LL') : '_'}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(bill.createdAt).format('LLLL')}
        </Typography>
        {new Date(bill.updatedAt) > new Date(bill.createdAt) && (
          <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Last update:
            </Typography>{' '}
            {moment(bill.updatedAt).format('LLLL')}
          </Typography>
        )}
        <Box mt="30px">
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
