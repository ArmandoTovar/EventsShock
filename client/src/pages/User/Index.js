// -----------IMPORTS-----------------------------------------------------------
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Alert,
  AlertTitle,
  Button,
  Zoom,
} from '@mui/material';
import { Box } from '@mui/system';
import CircularProgress from '../../components/CircularProgress';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import EditUser from './EditUser';
import ReportBar from './ReportBar';
import UserListHead from './UserListHead';
// dep
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useApolloClient } from '@apollo/client';
// hooks
import { useUsers } from '../../hooks/useUsers';
//utils
import { fDate } from '../../utils/formatTime';
// apollo
import { DELETE_USER, EDIT_USER } from '../../graphql/mutations';
import { ALL_USERS } from '../../graphql/queries';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Fullname', alignRight: false },
  { id: 'company', label: 'Username', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Birthday', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState();
  const apolloClient = useApolloClient();
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { users, fetchMore, loading } = useUsers({
    first: rowsPerPage,
  });
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);
  if (loading) return <CircularProgress />;

  const USERLIST = users ? users.edges.map((edge) => edge.node) : [];

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    if (page < newPage) {
      fetchMore();
    }

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName,
  );

  const deleteUser = async () => {
    const deleteUserId = open.id;

    try {
      const operation = await apolloClient.mutate({
        mutation: DELETE_USER,
        variables: {
          deleteUserId,
        },
        refetchQueries: [{ query: ALL_USERS }, 'Users'],
      });
      if (operation) {
        setOpenModal(true);
      }
    } catch (e) {}
  };

  const editUser = async (newEditUser, editUserId) => {
    try {
      const operation = await apolloClient.mutate({
        mutation: EDIT_USER,
        variables: {
          user: newEditUser,
          editUserId,
        },
        refetchQueries: [{ query: ALL_USERS }, 'Users'],
      });
      if (operation) {
        setOpenEdit(false);
        setOpenModal(true);
      }
    } catch (e) {}
  };

  const isNotFound = !filteredUsers.length && !!filterName;

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
            User
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="bytesize:print" />}
            onClick={() => setOpenReport(true)}
          >
            Print Report
          </Button>
        </Stack>

        <Card>
          <Zoom in={animate}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.totalCount}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        firstName,
                        lastName,
                        rol,
                        state,
                        email,
                        image,
                        birthdate,
                      } = row;
                      const selectedUser = selected.indexOf(firstName) !== -1;
                      return (
                        <TableRow
                          hover
                          key={'row' + id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar alt={firstName} src={image} />
                              <Typography variant="subtitle2" noWrap>
                                {firstName + ' ' + lastName}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{email}</TableCell>

                          <TableCell align="left">
                            {rol === 1 ? 'admin' : 'user'}
                          </TableCell>

                          <TableCell align="left">{fDate(birthdate)}</TableCell>

                          <TableCell align="left">
                            <Label color={(!state && 'error') || 'success'}>
                              {sentenceCase(state ? 'active' : 'ban')}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              id={id}
                              size="large"
                              color="inherit"
                              onClick={handleOpenMenu}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete
                            words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Zoom>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => setOpenEdit(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteUser()}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

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
      <ReportBar setOpen={setOpenReport} open={openReport} />
      {open && USERLIST.find(({ id }) => id === open.id) ? (
        <EditUser
          user={USERLIST.find(({ id }) => id === open.id)}
          open={openEdit}
          setOpen={setOpenEdit}
          editUser={editUser}
        />
      ) : (
        <></>
      )}
    </>
  );
}
