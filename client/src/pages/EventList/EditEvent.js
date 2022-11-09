// -----------IMPORTS-----------------------------------------------------------
import React, { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { MenuItem, TextField } from '@mui/material';
// hooks
import useInput from '../../hooks/useInput';
// components
import Notification from '../../components/Notification';
// services
import { GetImagenUrl } from '../../services/image';
// ----------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Type = [
  {
    value: 0,
    label: 'Subscribe',
  },
  {
    value: 1,
    label: 'Edit',
  },
  {
    value: 2,
    label: 'Delete',
  },
  {
    value: 3,
    label: 'Create',
  },
];
// ----------------------------------------------------------------------
const Editevent = ({
  event = {
    id: '',
    name: '',
    image: '',
    startDate: '',
    finishDate: '',
  },
  open = false,
  setOpen,
  createEvent,
  editEvent,
  deleteEvent,
  subsEvent,
  message = { error: true, msg: null },
  rol = 0,
}) => {
  const type = useInput('text', event.id === null ? 3 : 0);
  const name = useInput('text', event.name);
  const [avatar, setAvatar] = useState(null);
  const startDate = useInput(
    'date',
    new Date(event.startDate).toISOString().slice(0, 10),
  );
  const finishDate = useInput(
    'date',
    new Date(event.finishDate).toISOString().slice(0, 10),
  );
  const handleEdit = async (type) => {
    const editEventId = event.id;
    let tempName = {};
    let tempImg = {};
    if (name.value !== event.name) {
      tempName = { name: name.value };
    }

    if (avatar) {
      const avatarUrl = await GetImagenUrl(avatar);
      console.log(avatarUrl);
      tempImg = { image: avatarUrl };
    }
    const newEditevent = {
      startDate: startDate.value,
      finishDate: finishDate.value,
      ...tempImg,
      ...tempName,
    };

    switch (type.value) {
      case 0:
        subsEvent({ id: event.id });
        break;
      case 1:
        editEvent({ newEditevent, editEventId });
        break;
      case 2:
        deleteEvent({ id: event.id });
        break;
      case 3:
        createEvent({ newEditevent });
        break;
      default:
        break;
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted={false}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Event: ${event.name}`}</DialogTitle>
        <DialogContent>
          {event.id === null ? (
            <div></div>
          ) : (
            <TextField
              margin="normal"
              id="outlined-select-type"
              select
              label="Action"
              {...type}
            >
              {Type.map((option, index) => {
                if (index === 0) {
                  return (
                    <MenuItem key={option.value + index} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                } else {
                  if (rol === 1) {
                    return (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  }
                }
                return <div key={option.value}></div>;
              })}
            </TextField>
          )}
          {rol === 0 ? (
            <div></div>
          ) : type.value === 1 || event.id === null ? (
            <>
              <TextField
                id="filled-basic"
                label="Name"
                variant="filled"
                {...name}
                margin="normal"
              />
              <TextField
                id="filled-basic"
                label="startDate"
                variant="filled"
                {...startDate}
                margin="normal"
              />
              <TextField
                id="filled-basic"
                label="finishDate"
                variant="filled"
                {...finishDate}
                margin="normal"
              />
              <TextField
                id="filled-basic"
                label=""
                variant="filled"
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
                margin="normal"
                accept="image/png, image/jpeg"
              />
            </>
          ) : (
            <div></div>
          )}
        </DialogContent>
        <Notification message={message} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleEdit(type)}>
            {event.id === null
              ? 'Create'
              : type.value === 0
              ? 'Modify'
              : type.value === 1
              ? 'Edit'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Editevent;
