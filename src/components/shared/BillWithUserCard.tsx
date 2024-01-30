import { PropsWithChildren, FC, useCallback } from 'react';
import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AllBillList, BillWithUserObj, getDynamicPath, Pathes } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { useAuth, usePaginationList } from '../../hooks';

interface BillCardImportation extends PropsWithChildren {
  bill: BillWithUserObj;
  index: number;
  listInstance: ReturnType<typeof usePaginationList<AllBillList>>;
}

const BillWithUserCard: FC<BillCardImportation> = ({ bill, index, listInstance }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const isUserEqualToCurrentUser = auth.isUserEqualToCurrentUser(bill.user);

  const onCardClick = useCallback(() => {
    if (isUserEqualToCurrentUser) {
      const path = bill.deletedAt ? Pathes.DELETED_BILL : Pathes.BILL;
      navigate(getDynamicPath(path, { id: bill.id }));
    }
  }, [bill, isUserEqualToCurrentUser]);

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{
        my: '20px',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: isUserEqualToCurrentUser ? '#F8F8F8' : '',
      }}
      onClick={onCardClick}
    >
      <ListItemButton
        disableRipple={!isUserEqualToCurrentUser}
        disableTouchRipple={!isUserEqualToCurrentUser}
        sx={{
          cursor: isUserEqualToCurrentUser ? 'pointer' : 'unset',
        }}
      >
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="8px">
            <Box component="div" mb={'8px'}>
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 'bold' }}
                sx={{ margin: '0' }}
                primary={`${bill.receiver} received ${bill.amount} at ${moment(bill.date).format('ll')}`}
              />
            </Box>

            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Created by:{' '}
                    </Typography>
                    {bill.user.firstName + ' ' + bill.user.lastName}
                  </Typography>
                }
              />
            </Box>

            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Consumers:{' '}
                    </Typography>
                    {bill.consumers.map((consumer) => (
                      <Box
                        key={consumer}
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
                          sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)', textAlign: 'center' }}
                        >
                          {consumer}
                        </Typography>
                      </Box>
                    ))}
                  </Typography>
                }
              />
            </Box>

            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Description:{' '}
                    </Typography>
                    {bill.description}
                  </Typography>
                }
              />
            </Box>

            <Box component="div" alignSelf="end">
              <ListItemText
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  bill.deletedAt
                    ? `${moment(bill.deletedAt).format('lll')} was deleted.`
                    : new Date(bill.updatedAt) > new Date(bill.createdAt)
                    ? `updated at ${moment(bill.updatedAt).fromNow()}`
                    : `${moment(bill.createdAt).fromNow()}`
                }
              />
            </Box>
          </Box>

          <CountBadge index={index} page={listInstance.getPage()} take={listInstance.getTake()} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default BillWithUserCard;
