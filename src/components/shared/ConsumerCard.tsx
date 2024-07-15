import { PropsWithChildren, FC } from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { Pathes, ConsumerObj, getDynamicPath, ConsumerList } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { usePaginationList } from '../../hooks';
import { useNavigate } from 'react-router-dom';

interface ConsumerCardImportation extends PropsWithChildren {
  consumer: ConsumerObj;
  index: number;
  listInstance: ReturnType<typeof usePaginationList<ConsumerList>>;
}

const ConsumerCard: FC<ConsumerCardImportation> = ({ consumer, index, listInstance }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
      onClick={() => navigate(getDynamicPath(Pathes.CONSUMER, { id: consumer.id }))}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="8px">
            <Box component="div">
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 'bold' }}
                sx={{ margin: '0' }}
                primary={consumer.name}
              />
            </Box>

            <Box component="div" alignSelf="end">
              <ListItemText
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  new Date(consumer.updatedAt) > new Date(consumer.createdAt)
                    ? `updated at ${moment(consumer.updatedAt).fromNow()}`
                    : `${moment(consumer.createdAt).fromNow()}`
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

export default ConsumerCard;
