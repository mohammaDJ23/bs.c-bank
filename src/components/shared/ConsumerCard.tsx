import { PropsWithChildren, FC } from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { Pathes, ConsumerObj, getDynamicPath } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { useNavigate } from 'react-router-dom';
import { List } from '../../lib/lists/newList';

interface ConsumerCardImportation extends PropsWithChildren {
  consumer: ConsumerObj;
  index: number;
  list: List;
}

const ConsumerCard: FC<ConsumerCardImportation> = ({ consumer, index, list }) => {
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

          <CountBadge index={index} page={list.page} take={list.take} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default ConsumerCard;
