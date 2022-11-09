// -----------IMPORTS-----------------------------------------------------------
import React, { useEffect, useState } from 'react';
// @mui
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Modal,
  Alert,
  AlertTitle,
  Grow,
} from '@mui/material';
import { Box } from '@mui/system';
import CircularProgress from '../../components/CircularProgress';
// components
import CardEvent from './CardEvent';
import Iconify from '../../components/iconify';
import Editevent from './EditEvent';
// hooks
import { useEvents } from '../../hooks/useEvents';
import { useMe } from '../../hooks/useMe';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

// ----------------------------------------------------------------------

export default function Index() {
  const {
    events,
    loading,
    fetchMore,
    hasMore,
    editEvent,
    subsEvent,
    createEvent,
    deleteEvent,
  } = useEvents({
    first: 12,
  });
  const { measureRef, isIntersecting, observer } = useInfiniteScroll();
  const { me } = useMe();
  const [eventId, setEventId] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [messageError, setMessageError] = useState({ msg: null });
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);
  useEffect(() => {
    if (isIntersecting && hasMore) {
      fetchMore();
      observer.disconnect();
    }
    // eslint-disable-next-line
  }, [isIntersecting]);
  if (loading) return <CircularProgress />;
  const eventsNodes = events ? events.edges.map((edge) => edge.node) : [];

  const handleOpenEditModal = (dd) => {
    setEventId(eventsNodes.find(({ id }) => id === dd));
    setOpenEdit(true);
  };

  const setModal = (t) => {
    setOpenEdit(t);
    setEventId(undefined);
  };
  const createNewEvent = () => {
    setEventId({
      id: null,
      name: '',
      image: '',
      startDate: null,
      finishDate: null,
    });
    setOpenEdit(true);
  };

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Events
          </Typography>
          {me.rol === 1 ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => createNewEvent()}
            >
              New Event
            </Button>
          ) : (
            <></>
          )}
        </Stack>
        <Grow orientation="vertical" in={animate}>
          <Grid container spacing={3}>
            {eventsNodes.map((ev, index) =>
              index === eventsNodes.length - 1 ? (
                <CardEvent
                  handleOpenEditModal={handleOpenEditModal}
                  key={ev.id}
                  event={ev}
                  setEventId={setEventId}
                  eveRef={measureRef}
                  autorization={me?.rol}
                />
              ) : (
                <CardEvent
                  handleOpenEditModal={handleOpenEditModal}
                  key={ev.id}
                  event={ev}
                  setEventId={setEventId}
                  autorization={me?.rol}
                />
              ),
            )}
          </Grid>
        </Grow>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,

              p: 4,
            }}
          >
            <Alert severity="success">
              <AlertTitle>Operation</AlertTitle>
              <strong>successfully!</strong>
            </Alert>
          </Box>
        </Modal>
        {eventId !== undefined ? (
          <Editevent
            event={eventId}
            open={openEdit}
            setOpen={setModal}
            editEvent={async (props) =>
              await editEvent({
                ...props,
                setOpenEdit,
                setOpenModal,
                setEventId,
                setMessageError,
              })
            }
            deleteEvent={async (props) =>
              await deleteEvent({
                ...props,
                setOpenEdit,
                setOpenModal,
                setEventId,
                setMessageError,
              })
            }
            subsEvent={async (props) =>
              await subsEvent({
                ...props,
                me,
                setOpenEdit,
                setEventId,
                setMessageError,
              })
            }
            createEvent={async (props) =>
              await createEvent({
                ...props,
                setOpenEdit,
                setOpenModal,
                setEventId,
                setMessageError,
              })
            }
            rol={me.rol}
            message={messageError}
          />
        ) : (
          <></>
        )}
      </Container>
    </>
  );
}
