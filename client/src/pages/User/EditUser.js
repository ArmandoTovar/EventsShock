// -----------IMPORTS-----------------------------------------------------------
import * as React from 'react';
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
// ----------------------------------------------------------------------
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const rolType = [
  {
    value: 1,
    label: 'Admin',
  },
  {
    value: 0,
    label: 'User',
  },
];

const stateType = [
  {
    value: true,
    label: 'Active',
  },
  {
    value: false,
    label: 'Ban',
  },
];
// ----------------------------------------------------------------------
export default function EditUser({
  user = {
    id: '',
    state: false,
    rol: 1,
    firstName: '',
    lastName: '',
    birthdate: '',
  },
  open = false,
  setOpen,
  editUser,
}) {
  const state = useInput('text', user.state);
  const rol = useInput('text', user.rol);
  const firstName = useInput('text', user.firstName);
  const lastName = useInput('text', user.lastName);
  const birthdate = useInput(
    'date',
    new Date(user.birthdate).toISOString().slice(0, 10),
  );
  const handleEdit = () => {
    const editUserId = user.id;
    const newEditUser = {
      state: state.value,
      rol: rol.value,
      firstName: firstName.value,
      lastName: lastName.value,
      birthdate: birthdate.value,
    };
    editUser(newEditUser, editUserId);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`EditUser: ${user.email}`}</DialogTitle>
        <DialogContent>
          <TextField
            id="filled-basic"
            label="Firstname"
            variant="filled"
            {...firstName}
            margin="normal"
          />

          <TextField
            id="filled-basic"
            label="Lastname"
            variant="filled"
            {...lastName}
            margin="normal"
          />

          <TextField
            id="filled-basic"
            label="Birthdate"
            variant="filled"
            {...birthdate}
            margin="normal"
          />

          <TextField
            margin="normal"
            id="outlined-select-rol"
            select
            label="Role"
            {...rol}
          >
            {rolType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            id="outlined-select-state"
            select
            label="State"
            {...state}
          >
            {stateType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleEdit}>Agree</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
