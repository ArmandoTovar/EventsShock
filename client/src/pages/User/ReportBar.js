// -----------IMPORTS-----------------------------------------------------------
import React, { useState } from 'react';
// @mui
import {
  Button,
  CircularProgress,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
// hooks
import useInput from '../../hooks/useInput';
// services
import { GetReportPdf } from '../../services/pdf';
// ----------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SORT_BY_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'hour', label: 'Hour' },
];
// ----------------------------------------------------------------------

export default function ReportBar({ open = false, setOpen }) {
  const type = useInput('text', 'day');
  const [loading, setLoading] = useState(false);
  const startDate = useInput(
    'datetime-local',
    new Date().toISOString().slice(0, -8),
  );
  const finishDate = useInput(
    'datetime-local',
    new Date().toISOString().slice(0, -8),
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    setLoading(true);
    GetReportPdf({
      startDate: new Date(startDate.value),
      endDate: new Date(finishDate.value),
      type: type.value,
    }).then(() => {
      setLoading(false);
      setOpen(false);
    });
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{'Report'}</DialogTitle>
      <DialogContent>
        {!loading ? (
          <>
            <TextField
              margin="normal"
              id="outlined-select-type"
              select
              label="Action"
              fullWidth
              {...type}
            >
              {SORT_BY_OPTIONS.map((option, index) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="filled_report_startDate"
              label="finishDate"
              variant="filled"
              type="datetime-local"
              {...startDate}
              margin="normal"
              fullWidth
            />
            <TextField
              id="filled_report_finishDate"
              label="finishDate"
              variant="filled"
              {...finishDate}
              margin="normal"
              fullWidth
            />{' '}
          </>
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
      <DialogActions>
        {loading ? (
          <></>
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDownload}>Download</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
