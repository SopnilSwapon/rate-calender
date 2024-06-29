import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { FaUsers } from "react-icons/fa6";
import MinLenghtRow from '../components/MinLenghtRow';
import ReservationRow from '../components/ReservationRow';
import RoomRates from '../components/RoomRates';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 'calc(100vh - 200px)',
  overflowX: 'auto',
});

const StickyTableHead = styled(TableHead)({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: 'white',
});

export default function SingleInputDateRangePicker() {
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(15, 'day')]);
  const [formattedDateRange, setFormattedDateRange] = useState('');
  const [dates, setDates] = useState([]);

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    if (start && end) {
      let currentDate = start;
      const datesArray = [];
      while (currentDate.isBefore(end) || currentDate.isSame(end)) {
        const dayOfMonth = currentDate.format('D');
        const dayName = currentDate.format('ddd');
        datesArray.push(`${dayOfMonth}, ${dayName}`);
        currentDate = currentDate.add(1, 'day');
      }
      if (!currentDate.isSame(end)) {
        datesArray.push(`${end.format('D')}, ${end.format('ddd')}`);
      }
      setDateRange(newValue);
      setDates(datesArray);
      setFormattedDateRange(`start_date=${start.format('YYYY-MM-DD')}&end_date=${end.format('YYYY-MM-DD')}`);
    }
  };

  useEffect(() => {
    handleDateChange([dayjs(), dayjs().add(15, 'day')]);
  }, []);

  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ['rooms', formattedDateRange],
    queryFn: async () => {
      const res = await fetch(`https://api.bytebeds.com/api/v1/property/1/room/rate-calendar/assessment?${formattedDateRange}`);
      if (!res.ok) {
        throw new Error('Your Network response is Poor.');
      }
      return res.json();
    }
  });

  if (isLoading) return 'Loading...';
  if (error) return `An error has occurred: ${error.message}`;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker
          className='w-[25%]'
          slots={{ field: SingleInputDateRangeField }}
          name="allowedRange"
          value={dateRange}
          onChange={handleDateChange}
        />
        <StyledTableContainer component={Paper}>
          <Table stickyHeader aria-label="customized table">
            <StickyTableHead>
              <TableRow>
                <StyledTableCell align='right'>Date</StyledTableCell>
                {dates.map((date, index) => (
                  <StyledTableCell align='right' key={index}>{date.split(', ')[0]} <br /> {date.split(', ')[1]}</StyledTableCell>
                ))}
              </TableRow>
            </StickyTableHead>
            <TableBody>
              {rooms?.data?.map((room, index) => (
                <>
                  <StyledTableRow key={index} className='text-xl font-bold text-nowrap'>
                    <StyledTableCell colSpan={dates?.length + 1}>{room?.name}</StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell className='text-nowrap' component="th" scope="row">Room status</StyledTableCell>
                    {room?.inventory_calendar?.map((roomStatus, index) => (
                      <StyledTableCell align="right" key={index} className='bg-green-700 !text-white'>
                        {roomStatus?.status ? 'Open' : 'Close'}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">Rooms Sell</StyledTableCell>
                    {room?.inventory_calendar?.map((isSell, index) => (
                      <StyledTableCell align="right" key={index}>
                        {isSell?.available ?? 0}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">Net Booked</StyledTableCell>
                    {room?.inventory_calendar?.map((isBooked, index) => (
                      <StyledTableCell align="right" key={index}>
                        {isBooked?.booked ?? 0}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                  {room?.rate_plans?.map((plan, idx) => (
                    <>
                      <StyledTableRow key={idx}>
                        <StyledTableCell component="th" scope="row">
                          <p>{plan?.name} <br /> <span className='flex items-center gap-2'><FaUsers className='text-green-500' /> X {room?.occupancy}</span></p>
                        </StyledTableCell>
                        <RoomRates roomRates={plan}></RoomRates>
                      </StyledTableRow>
                      <StyledTableRow key={`minLength-${idx}`}>
                        <StyledTableCell component="th" scope="row">Min.length of Stay</StyledTableCell>
                        <MinLenghtRow minLengthInfo={plan}></MinLenghtRow>
                      </StyledTableRow>
                      <StyledTableRow key={`reservation-${idx}`}>
                        <StyledTableCell component="th" scope="row">Min. advance reservation</StyledTableCell>
                        <ReservationRow reservationInfo={plan}></ReservationRow>
                      </StyledTableRow>
                    </>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </DemoContainer>
    </LocalizationProvider>
  );
}
