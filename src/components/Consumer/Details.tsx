import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { Consumer, getDynamicPath, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteConsumerApi } from '../../apis';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface DetailsImporation {
  consumer: Consumer;
}

const Details: FC<DetailsImporation> = ({ consumer }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const isDeleteConsumerApiProcessing = request.isApiProcessing(DeleteConsumerApi);
  const isDeleteConsumerApiFailed = request.isProcessingApiFailed(DeleteConsumerApi);
  const isDeleteConsumerApiSuccess = request.isProcessingApiSuccessed(DeleteConsumerApi);
  const deleteConsumerApiExceptionMesaage = request.getExceptionMessage(DeleteConsumerApi);
  const options = [{ label: 'Update', path: getDynamicPath(Pathes.UPDATE_CONSUMER, { id: consumer.id }) }];

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

  const onDeleteConsumer = useCallback(() => {
    actions.showModal(ModalNames.CONFIRMATION);
  }, []);

  const deleteConsumer = useCallback(() => {
    actions.deleteConsumer(consumer.id);
  }, [consumer]);

  useEffect(() => {
    if (isDeleteConsumerApiSuccess) {
      actions.hideModal(ModalNames.CONFIRMATION);
      navigate(Pathes.CONSUMERS);
    } else if (isDeleteConsumerApiFailed) {
      snackbar.enqueueSnackbar({ message: deleteConsumerApiExceptionMesaage, variant: 'error' });
    }
  }, [isDeleteConsumerApiFailed, isDeleteConsumerApiSuccess]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px" overflow="hidden">
        <Box mb="15px" width="100%" overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                width: '100%',
                display: 'flex',
                gap: '8px',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
                {consumer.name}
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
        </Box>
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.02s',
              }}
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Created at:
              </Typography>{' '}
              {moment(consumer.createdAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        {new Date(consumer.updatedAt) > new Date(consumer.createdAt) && (
          <Box overflow="hidden">
            <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
              <Typography
                component={'p'}
                fontSize="12px"
                color="rgba(0, 0, 0, 0.6)"
                sx={{
                  transform: 'translateY(100%)',
                  transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                  transitionDelay: '0.04s',
                }}
              >
                <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                  Last update:
                </Typography>{' '}
                {moment(consumer.updatedAt).format('LLLL')}
              </Typography>
            </ResetStyleWithAnimation>
          </Box>
        )}
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              mt="30px"
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.06s',
              }}
            >
              <Button
                disabled={isDeleteConsumerApiProcessing}
                onClick={onDeleteConsumer}
                variant="contained"
                color="error"
                size="small"
                sx={{ textTransform: 'capitalize' }}
              >
                Delete the consumer
              </Button>
            </Box>
          </ResetStyleWithAnimation>
        </Box>
      </Box>
      <Modal
        title="Deleting the consumer"
        body="Are you sure do delete the consumer?"
        isLoading={isDeleteConsumerApiProcessing}
        isActive={selectors.modals[ModalNames.CONFIRMATION]}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteConsumer()}
      />
    </>
  );
};

export default Details;
