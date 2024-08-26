import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { getDynamicPath, Pathes, Receiver } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteReceiverApi } from '../../apis';
import { useSnackbar } from 'notistack';

interface DetailsImporation {
  receiver: Receiver;
}

const Details: FC<DetailsImporation> = ({ receiver }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const isDeleteReceiverApiProcessing = request.isApiProcessing(DeleteReceiverApi);
  const isDeleteReceiverApiFailed = request.isProcessingApiFailed(DeleteReceiverApi);
  const isDeleteReceiverApiSuccessed = request.isProcessingApiSuccessed(DeleteReceiverApi);
  const deleteReceiverApiExceptionMessage = request.getExceptionMessage(DeleteReceiverApi);
  const options = [{ label: 'Update', path: getDynamicPath(Pathes.UPDATE_RECEIVER, { id: receiver.id }) }];

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

  const onDeleteReceiver = useCallback(() => {
    actions.showModal(ModalNames.CONFIRMATION);
  }, []);

  const deleteReceiver = useCallback(() => {
    actions.deleteReceiver(receiver.id);
  }, [receiver]);

  useEffect(() => {
    if (isDeleteReceiverApiSuccessed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      navigate(Pathes.RECEIVERS);
    } else if (isDeleteReceiverApiFailed) {
      snackbar.enqueueSnackbar({ message: deleteReceiverApiExceptionMessage, variant: 'error' });
    }
  }, [isDeleteReceiverApiFailed, isDeleteReceiverApiSuccessed]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
            {receiver.name}
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
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(receiver.createdAt).format('LLLL')}
        </Typography>
        {new Date(receiver.updatedAt) > new Date(receiver.createdAt) && (
          <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Last update:
            </Typography>{' '}
            {moment(receiver.updatedAt).format('LLLL')}
          </Typography>
        )}
        <Box mt="30px">
          <Button
            disabled={isDeleteReceiverApiProcessing}
            onClick={onDeleteReceiver}
            variant="contained"
            color="error"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          >
            Delete the Receiver
          </Button>
        </Box>
      </Box>
      <Modal
        title="Deleting the Receiver"
        body="Are you sure do delete the receiver?"
        isLoading={isDeleteReceiverApiProcessing}
        isActive={selectors.modals[ModalNames.CONFIRMATION]}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteReceiver()}
      />
    </>
  );
};

export default Details;
